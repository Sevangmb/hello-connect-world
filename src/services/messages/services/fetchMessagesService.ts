
import { supabase } from '@/integrations/supabase/client';
import { PrivateMessage } from '@/types/messages';
import { PrivateMessageResponse } from '../types/messageTypes';

/**
 * Fetches messages between the current user and a partner
 */
export async function fetchMessages(partnerId: string): Promise<PrivateMessage[]> {
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
}
