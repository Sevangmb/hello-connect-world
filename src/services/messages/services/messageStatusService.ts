
import { supabase } from '@/integrations/supabase/client';
import { UpdateMessageRequest } from '../types/messageTypes';

/**
 * Marque les messages d'un expéditeur comme lus
 */
export async function markMessagesAsRead(senderId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Create an update object with the correct type
  const updateData: UpdateMessageRequest = {
    is_read: true
  };
  
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
}

/**
 * Compte les messages non lus pour l'utilisateur actuel
 */
export async function countUnreadMessages(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { count, error } = await supabase
    .from('private_messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .eq('is_read', false);
  
  if (error) {
    console.error('Error counting unread messages:', error);
    throw new Error('Failed to count unread messages');
  }
  
  return count || 0;
}

/**
 * Vérifie le statut en ligne d'un utilisateur
 */
export async function checkUserOnlineStatus(userId: string): Promise<boolean> {
  try {
    // Check if the user has recent activity in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('last_seen_at')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking online status:', error);
      return Math.random() > 0.3; // Fallback: simulate a random status
    }
    
    // Consider user online if they've been active in the last 5 minutes
    if (data?.last_seen_at) {
      const lastSeen = new Date(data.last_seen_at);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return lastSeen > fiveMinutesAgo;
    }
    
    // Fallback to random status for demo
    return Math.random() > 0.3;
  } catch (error) {
    console.error('Error checking online status:', error);
    return Math.random() > 0.3; // Fallback: simulate a random status
  }
}

/**
 * Met à jour la liste des utilisateurs en ligne (pour la démo)
 */
export async function updateOnlineUsers(userIds: string[]): Promise<Record<string, boolean>> {
  if (!userIds.length) return {};
  
  // Create a map to store status for each user
  const onlineStatuses: Record<string, boolean> = {};
  
  for (const userId of userIds) {
    try {
      const isOnline = await checkUserOnlineStatus(userId);
      onlineStatuses[userId] = isOnline;
    } catch {
      // If error, set a random online status
      onlineStatuses[userId] = Math.random() > 0.3;
    }
  }
  
  return onlineStatuses;
}
