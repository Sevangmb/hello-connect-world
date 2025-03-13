
import { supabase } from '@/integrations/supabase/client';
import { UpdateMessageRequest } from '../types/messageTypes';

/**
 * Marks messages from a sender as read
 */
export async function markMessagesAsRead(senderId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const updateData: UpdateMessageRequest = { is_read: true };
  
  const { error } = await supabase
    .from('private_messages')
    .update(updateData as any) // Using type assertion to bypass TypeScript error
    .eq('sender_id', senderId)
    .eq('receiver_id', user.id)
    .eq('is_read', false);
  
  if (error) {
    console.error('Error marking messages as read:', error);
    throw new Error('Failed to mark messages as read');
  }
}

/**
 * Counts unread messages for the current user
 */
export async function countUnreadMessages(): Promise<number> {
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
