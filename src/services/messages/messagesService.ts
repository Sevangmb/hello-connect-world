
import { supabase } from '@/integrations/supabase/client';
import { Message, PrivateMessage } from '@/types/messages';

// Define an interface for the create message request
interface CreateMessageRequest {
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

// Type spécifique pour les mises à jour de messages
interface MessageUpdatePayload {
  is_read: boolean;
}

// Type pour les conversations retournées par la fonction RPC
interface UserConversation {
  id: string;
  user: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    is_online?: boolean;
  };
  lastMessage: {
    content: string;
    created_at: string;
  };
  unreadCount: number;
}

export const messagesService = {
  /**
   * Récupère les messages d'une conversation privée
   */
  async fetchMessages(partnerId: string): Promise<PrivateMessage[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('private_messages')
      .select(`
        *,
        sender:sender_id (id, username, avatar_url),
        receiver:receiver_id (id, username, avatar_url)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .or(`sender_id.eq.${partnerId},receiver_id.eq.${partnerId}`)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
    
    return data as unknown as PrivateMessage[];
  },
  
  /**
   * Envoie un message privé
   */
  async sendMessage(receiverId: string, content: string): Promise<PrivateMessage> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create the message request with required fields
    const messageRequest: CreateMessageRequest = {
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString()
    };
    
    // Insert message with appropriate type handling
    const { data, error } = await supabase
      .from('private_messages')
      .insert(messageRequest)
      .select(`
        *,
        sender:sender_id (id, username, avatar_url),
        receiver:receiver_id (id, username, avatar_url)
      `)
      .single();
    
    if (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
    
    // Use a type assertion to avoid deep nested type checking
    return data as unknown as PrivateMessage;
  },
  
  /**
   * Récupère les conversations d'un utilisateur
   */
  async fetchConversations(): Promise<UserConversation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Utiliser invoke au lieu de rpc pour éviter les erreurs de type
    const { data, error } = await supabase.functions.invoke('get_user_conversations', {
      body: { user_id: user.id }
    });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      throw new Error('Failed to fetch conversations');
    }
    
    return data || [];
  },
  
  /**
   * Marque les messages comme lus
   */
  async markMessagesAsRead(senderId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Définir explicitement les champs à mettre à jour 
    const { error } = await supabase
      .from('private_messages')
      .update({ is_read: true } as MessageUpdatePayload)
      .eq('sender_id', senderId)
      .eq('receiver_id', user.id)
      .eq('is_read', false);
    
    if (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  },
  
  /**
   * Compte les messages non lus
   */
  async countUnreadMessages(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return 0;
    }
    
    const { count, error } = await supabase
      .from('private_messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);
    
    if (error) {
      console.error('Error counting unread messages:', error);
      return 0;
    }
    
    return count || 0;
  }
};
