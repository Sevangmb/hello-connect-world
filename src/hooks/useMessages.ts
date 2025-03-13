
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message, PrivateMessage } from '@/types/messages';
import { messagesService } from '@/services/messages/messagesService';

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
        
        // Attempt to get conversations from the database
        const { data, error } = await supabase.rpc(
          'get_user_conversations' as any, 
          { user_id: user.id }
        );
        
        if (error) throw error;
        
        if (data) {
          // Use explicit type assertion to avoid infinite recursion
          setConversations(data as any as Conversation[]);
        }
        
        // Count unread messages
        const { count, error: countError } = await supabase
          .from('private_messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false);
          
        if (!countError) {
          setUnreadCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
    
    // Set up realtime subscription for new messages
    const channel = supabase
      .channel('private_messages_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages'
      }, () => {
        fetchConversations();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add this function to load messages for a specific conversation
  const fetchMessages = async (partnerId: string) => {
    if (!partnerId) return;
    
    setLoading(true);
    setCurrentConversation(partnerId);
    
    try {
      const fetchedMessages = await messagesService.fetchMessages(partnerId);
      setMessages(fetchedMessages);
      
      // Mark messages as read
      await messagesService.markMessagesAsRead(partnerId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to send a message
  const sendMessage = async (receiverId: string, content: string) => {
    if (!receiverId || !content.trim()) return;
    
    setSendingMessage(true);
    try {
      const sentMessage = await messagesService.sendMessage(receiverId, content);
      setMessages(prev => [...prev, sentMessage]);
      return sentMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setSendingMessage(false);
    }
  };
  
  return {
    conversations,
    messages,
    loading,
    unreadCount,
    sendingMessage,
    currentConversation,
    currentUserId,
    fetchMessages,
    sendMessage
  };
}
