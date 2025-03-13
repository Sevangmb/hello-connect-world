
import { PrivateMessage } from '@/types/messages';
import { IMessageService } from './domain/IMessageService';
import { UserConversation } from './types/messageTypes';
import { fetchMessages } from './services/fetchMessagesService';
import { sendMessage } from './services/sendMessageService';
import { fetchConversations } from './services/conversationsService';
import { markMessagesAsRead, countUnreadMessages } from './services/messageStatusService';

/**
 * Implementation of the message service using Supabase
 */
export const messagesService: IMessageService = {
  fetchMessages,
  sendMessage,
  fetchConversations,
  markMessagesAsRead,
  countUnreadMessages
};
