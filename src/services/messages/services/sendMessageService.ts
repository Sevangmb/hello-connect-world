
import { supabase } from '@/integrations/supabase/client';
import { PrivateMessage } from '@/types/messages';
import { CreateMessageRequest } from '../types/messageTypes';

/**
 * Sends a message to a recipient
 */
export async function sendMessage(receiverId: string, content: string): Promise<PrivateMessage> {
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
}
