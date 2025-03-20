
import { PrivateMessage } from '@/types/messages';
import { IMessageService } from './domain/IMessageService';
import { UserConversation } from './types/messageTypes';
import { fetchMessages } from './services/fetchMessagesService';
import { sendMessage } from './services/sendMessageService';
import { fetchConversations } from './services/conversationsService';
import { 
  markMessagesAsRead, 
  countUnreadMessages, 
  checkUserOnlineStatus,
  updateOnlineUsers
} from './services/messageStatusService';

/**
 * Implémentation du service de messages utilisant Supabase
 */
export const messagesService: IMessageService = {
  fetchMessages,
  sendMessage,
  fetchConversations,
  markMessagesAsRead,
  countUnreadMessages,
  checkUserOnlineStatus,
  updateOnlineUsers
};
