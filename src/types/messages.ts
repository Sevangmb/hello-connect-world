
export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
}

export interface PrivateMessage extends Message {
  sender_id: string;
  receiver_id: string;
  sender: Profile;
  receiver: Profile;
}

export interface Conversation {
  user: Profile;
  lastMessage: PrivateMessage;
}

export interface GroupMessage extends Message {
  sender_id: string;
  group_id: string;
  sender: Profile;
}
