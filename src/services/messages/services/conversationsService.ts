
import { supabase } from '@/integrations/supabase/client';
import { UserConversation } from '../types/messageTypes';

/**
 * Fetches all conversations for the current user
 */
export async function fetchConversations(): Promise<UserConversation[]> {
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
}
