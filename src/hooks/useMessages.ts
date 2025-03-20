
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation, PrivateMessage } from '@/types/messages';
import { messagesService } from '@/services/messages/messagesService';
import { useToast } from '@/hooks/use-toast';

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

  // Fonction pour mettre à jour les statuts en ligne
  const updateOnlineStatus = useCallback(async (userIds: string[]) => {
    try {
      const statuses = await messagesService.updateOnlineUsers(userIds);
      setOnlineUsers(statuses);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statuts en ligne:', error);
    }
  }, []);

  // Charger les conversations et configurer les abonnements temps réel
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
        
        // Récupérer les conversations
        const data = await messagesService.fetchConversations();
        
        // Mettre à jour les statuts en ligne
        const userIds = data.map(conv => conv.user.id);
        const statuses = await messagesService.updateOnlineUsers(userIds);
        
        // Intégrer les statuts en ligne dans les conversations
        const conversationsWithStatus = data.map(conv => ({
          ...conv,
          user: {
            ...conv.user,
            is_online: statuses[conv.user.id] || false
          }
        }));
        
        setConversations(conversationsWithStatus as unknown as Conversation[]);
        
        // Compter les messages non lus
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
    
    // Mettre en place un rafraîchissement périodique des statuts en ligne
    const onlineStatusInterval = setInterval(() => {
      if (conversations.length > 0) {
        const userIds = conversations.map(conv => conv.id);
        updateOnlineStatus(userIds);
      }
    }, 30000); // Toutes les 30 secondes
    
    // Configurer la souscription en temps réel pour les nouveaux messages
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

  // Charger les messages pour une conversation spécifique
  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!partnerId) return;
    
    setLoading(true);
    setCurrentConversation(partnerId);
    
    try {
      const fetchedMessages = await messagesService.fetchMessages(partnerId);
      setMessages(fetchedMessages);
      
      // Marquer les messages comme lus
      await messagesService.markMessagesAsRead(partnerId);
      
      // Mettre à jour le compteur de messages non lus
      const count = await messagesService.countUnreadMessages();
      setUnreadCount(count);
      
      // Vérifier si l'utilisateur est en ligne
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

  // Envoyer un message
  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!receiverId || !content.trim()) return;
    
    setSendingMessage(true);
    try {
      const sentMessage = await messagesService.sendMessage(receiverId, content);
      setMessages(prev => [...prev, sentMessage]);
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
  
  // Effacer la conversation actuelle
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
