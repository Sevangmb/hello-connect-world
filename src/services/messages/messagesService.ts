
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from '@/types/messages';

/**
 * Service pour gérer les fonctionnalités de messagerie avec Supabase
 */
export const messagesService = {
  /**
   * Récupère toutes les conversations de l'utilisateur courant
   */
  async fetchConversations(): Promise<Conversation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      // Récupérer les messages privés où l'utilisateur est expéditeur ou destinataire
      const { data, error } = await supabase
        .from('private_messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          sender:profiles!private_messages_sender_id_fkey(
            id, username, avatar_url
          ),
          receiver:profiles!private_messages_receiver_id_fkey(
            id, username, avatar_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Regrouper les messages par conversation et récupérer les derniers messages
      const conversationsMap = new Map<string, Conversation>();
      
      data?.forEach(message => {
        // Déterminer l'autre participant de la conversation
        const isMessageSender = message.sender_id === user.id;
        const partner = isMessageSender ? message.receiver : message.sender;
        
        if (!conversationsMap.has(partner.id)) {
          conversationsMap.set(partner.id, {
            id: partner.id,
            user: partner,
            lastMessage: message,
            unreadCount: 0, // À implémenter plus tard
          });
        } else {
          // Mettre à jour uniquement si ce message est plus récent
          const existingConversation = conversationsMap.get(partner.id)!;
          const existingDate = new Date(existingConversation.lastMessage.created_at);
          const newDate = new Date(message.created_at);
          
          if (newDate > existingDate) {
            conversationsMap.set(partner.id, {
              ...existingConversation,
              lastMessage: message,
            });
          }
        }
      });

      return Array.from(conversationsMap.values());
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      throw error;
    }
  },

  /**
   * Récupère les messages d'une conversation spécifique
   */
  async fetchMessages(conversationPartnerId: string): Promise<Message[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase
        .from('private_messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          sender:profiles!private_messages_sender_id_fkey(
            id, username, avatar_url
          ),
          receiver:profiles!private_messages_receiver_id_fkey(
            id, username, avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${conversationPartnerId}),and(sender_id.eq.${conversationPartnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }
  },

  /**
   * Envoie un nouveau message
   */
  async sendMessage(receiverId: string, content: string): Promise<Message> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase
        .from('private_messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content
        })
        .select(`
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          sender:profiles!private_messages_sender_id_fkey(
            id, username, avatar_url
          ),
          receiver:profiles!private_messages_receiver_id_fkey(
            id, username, avatar_url
          )
        `)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  },

  /**
   * Marquer les messages comme lus
   */
  async markMessagesAsRead(senderId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { error } = await supabase
        .from('private_messages')
        .update({ is_read: true })
        .match({ sender_id: senderId, receiver_id: user.id, is_read: false });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors du marquage des messages comme lus:', error);
      throw error;
    }
  }
};
