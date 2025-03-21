
import { Profile } from '@/types/messages';

// Base message request type for common properties
export interface BaseMessageRequest {
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

// Type for creating a new message
export interface CreateMessageRequest extends BaseMessageRequest {
  // Additional fields can be added here if needed
}

// Type for updating message properties - specifically for marking as read
export interface UpdateMessageRequest {
  is_read: boolean;
}

// Conversation data returned from the RPC function
export interface UserConversation {
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

// Response from fetching private messages
export interface PrivateMessageResponse {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  is_read: boolean;
  updated_at?: string;
  sender: Profile;
  receiver: Profile;
}

// Interface utilisée pour les mises à jour de profil
export interface ProfileUpdate {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

