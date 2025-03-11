
export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  full_name?: string | null;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  is_read?: boolean;
  sender: Profile;
  receiver: Profile;
}

export interface Conversation {
  id: string;
  user: Profile;
  lastMessage: Message;
  unreadCount?: number;
  is_group?: boolean;
  name?: string;
}

export interface GroupConversation extends Conversation {
  is_group: true;
  name: string;
  members?: Profile[];
}
