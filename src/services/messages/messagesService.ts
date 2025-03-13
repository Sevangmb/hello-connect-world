
import { supabase } from '@/integrations/supabase/client';
import { Message, PrivateMessage } from '@/types/messages';

// Define an interface for the create message request
interface CreateMessageRequest {
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

// Type pour les mises à jour de messages
interface UpdateMessageRequest {
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
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
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
    
    // Obtenir les messages privés les plus récents pour chaque conversation
    const { data, error } = await supabase
      .from('private_messages')
      .select(`
        id,
        content,
        created_at,
        is_read,
        sender_id,
        receiver_id,
        sender:sender_id (id, username, avatar_url),
        receiver:receiver_id (id, username, avatar_url)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching conversations:', error);
      throw new Error('Failed to fetch conversations');
    }
    
    // Transformer les données en format de conversation
    const conversationsMap = new Map<string, UserConversation>();
    
    data.forEach((message: any) => {
      // Déterminer s'il s'agit d'un message envoyé ou reçu
      const isMessageSent = message.sender_id === user.id;
      const partnerId = isMessageSent ? message.receiver_id : message.sender_id;
      const partner = isMessageSent ? message.receiver : message.sender;
      
      // Si la conversation n'existe pas encore, l'ajouter
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          id: partnerId,
          user: {
            id: partner.id,
            username: partner.username,
            avatar_url: partner.avatar_url,
            is_online: Math.random() > 0.3 // Simuler le statut en ligne
          },
          lastMessage: {
            content: message.content,
            created_at: message.created_at
          },
          unreadCount: !isMessageSent && !message.is_read ? 1 : 0
        });
      } else if (!isMessageSent && !message.is_read) {
        // Incrementer le compteur de messages non lus
        const conversation = conversationsMap.get(partnerId)!;
        conversation.unreadCount += 1;
      }
    });
    
    // Convertir la Map en tableau et trier par date du dernier message
    return Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());
  },
  
  /**
   * Marque les messages comme lus
   */
  async markMessagesAsRead(senderId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Corrected: Use the UpdateMessageRequest type and add proper fields for update
    const updateData: UpdateMessageRequest = { is_read: true };
    
    const { error } = await supabase
      .from('private_messages')
      .update(updateData)
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
