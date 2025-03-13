
import { PrivateMessage } from '@/types/messages';
import { UserConversation } from '../types/messageTypes';

/**
 * Interface defining message service capabilities
 */
export interface IMessageService {
  /**
   * Fetches messages between the current user and a partner
   */
  fetchMessages(partnerId: string): Promise<PrivateMessage[]>;
  
  /**
   * Sends a message to a recipient
   */
  sendMessage(receiverId: string, content: string): Promise<PrivateMessage>;
  
  /**
   * Fetches all conversations for the current user
   */
  fetchConversations(): Promise<UserConversation[]>;
  
  /**
   * Marks messages from a sender as read
   */
  markMessagesAsRead(senderId: string): Promise<void>;
  
  /**
   * Counts unread messages for the current user
   */
  countUnreadMessages(): Promise<number>;
}
