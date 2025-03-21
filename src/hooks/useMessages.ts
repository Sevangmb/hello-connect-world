
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation, PrivateMessage } from '@/types/messages';
import { messagesService } from '@/services/messages/messagesService';
import { useToast } from '@/hooks/use-toast';
import { ProfileUpdate } from '@/services/messages/types/messageTypes';

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Function to update online statuses
  const updateOnlineStatus = useCallback(async (userIds: string[]) => {
    try {
      const statuses = await messagesService.updateOnlineUsers(userIds);
      setOnlineUsers(statuses);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statuts en ligne:', error);
    }
  }, []);

  // Load conversations and set up real-time subscriptions
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        setCurrentUserId(user.id);
        
        // Update current user's activity timestamp
        const update: ProfileUpdate = {
          updated_at: new Date().toISOString()
        };
        
        await supabase
          .from('profiles')
          .update(update)
          .eq('id', user.id);
        
        // Fetch conversations
        const data = await messagesService.fetchConversations();
        
        // Update online statuses
        const userIds = data.map(conv => conv.user.id);
        const statuses = await messagesService.updateOnlineUsers(userIds);
        
        // Integrate online statuses into conversations
        const conversationsWithStatus = data.map(conv => ({
          ...conv,
          user: {
            ...conv.user,
            is_online: statuses[conv.user.id] || false
          }
        }));
        
        setConversations(conversationsWithStatus as unknown as Conversation[]);
        
        // Count unread messages
        const count = await messagesService.countUnreadMessages();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les conversations'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
    
    // Set up periodic refresh of online statuses
    const onlineStatusInterval = setInterval(() => {
      if (conversations.length > 0) {
        const userIds = conversations.map(conv => conv.id);
        updateOnlineStatus(userIds);
        
        // Update current user's activity timestamp to maintain online status
        const updateUserStatus = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const update: ProfileUpdate = {
              updated_at: new Date().toISOString()
            };
            
            await supabase
              .from('profiles')
              .update(update)
              .eq('id', user.id);
          }
        };
        updateUserStatus();
      }
    }, 30000); // Every 30 seconds
    
    // Configure real-time subscription for new messages
    const channel = supabase
      .channel('private_messages_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages'
      }, () => {
        fetchConversations();
        if (currentConversation) {
          fetchMessages(currentConversation);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
      clearInterval(onlineStatusInterval);
    };
  }, [toast, updateOnlineStatus]);

  // Load messages for a specific conversation
  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!partnerId) return;
    
    setLoading(true);
    setCurrentConversation(partnerId);
    
    try {
      const fetchedMessages = await messagesService.fetchMessages(partnerId);
      setMessages(fetchedMessages);
      
      // Mark messages as read
      await messagesService.markMessagesAsRead(partnerId);
      
      // Update unread message counter
      const count = await messagesService.countUnreadMessages();
      setUnreadCount(count);
      
      // Check if the user is online
      const isOnline = await messagesService.checkUserOnlineStatus(partnerId);
      setOnlineUsers(prev => ({ ...prev, [partnerId]: isOnline }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les messages'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Send a message
  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!receiverId || !content.trim()) return;
    
    setSendingMessage(true);
    try {
      const sentMessage = await messagesService.sendMessage(receiverId, content);
      setMessages(prev => [...prev, sentMessage]);
      
      // Update current user's activity timestamp
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const update: ProfileUpdate = {
          updated_at: new Date().toISOString()
        };
        
        await supabase
          .from('profiles')
          .update(update)
          .eq('id', user.id);
      }
      
      return sentMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message'
      });
      throw error;
    } finally {
      setSendingMessage(false);
    }
  }, [toast]);
  
  // Clear current conversation
  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
  }, []);
  
  return {
    conversations,
    messages,
    loading,
    unreadCount,
    sendingMessage,
    currentConversation,
    currentUserId,
    onlineUsers,
    fetchMessages,
    sendMessage,
    clearCurrentConversation,
    updateOnlineStatus
  };
}
