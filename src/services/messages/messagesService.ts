
import { supabase } from '@/integrations/supabase/client';
import { Message, PrivateMessage } from '@/types/messages';

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
    
    // Message avec is_read défini explicitement pour correspondre à la table private_messages
    const { data, error } = await supabase
      .from('private_messages')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        is_read: false,
        created_at: new Date().toISOString()
      })
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
    
    return data as unknown as PrivateMessage;
  },
  
  /**
   * Récupère les conversations d'un utilisateur
   */
  async fetchConversations() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Utiliser la fonction SQL personnalisée
    const { data, error } = await supabase.rpc(
      'get_user_conversations' as any, // Cast nécessaire car le type n'est pas inclus dans les définitions
      { user_id: user.id } // Ajouter les paramètres requis
    );
    
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
    
    const { error } = await supabase
      .from('private_messages')
      .update({ is_read: true })
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
