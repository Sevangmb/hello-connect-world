
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
  
  // Créer un objet de mise à jour avec le type correct
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
    // Cette requête est simulée car dans une application réelle, 
    // on utiliserait un service de présence Supabase
    const { data, error } = await supabase
      .from('user_presence')
      .select('is_online')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // En cas d'erreur, retourner un statut aléatoire pour la démo
      return Math.random() > 0.3;
    }
    
    return data?.is_online || false;
  } catch (error) {
    console.error('Error checking online status:', error);
    // Simuler un statut en ligne pour la démo
    return Math.random() > 0.3;
  }
}

/**
 * Met à jour la liste des utilisateurs en ligne (pour la démo)
 */
export async function updateOnlineUsers(userIds: string[]): Promise<Record<string, boolean>> {
  if (!userIds.length) return {};
  
  // Simulation d'une requête pour obtenir les statuts en ligne
  const onlineStatuses: Record<string, boolean> = {};
  
  // Pour chaque utilisateur, générer un statut aléatoire
  userIds.forEach(id => {
    onlineStatuses[id] = Math.random() > 0.3;
  });
  
  return onlineStatuses;
}
