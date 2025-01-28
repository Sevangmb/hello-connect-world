export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

export interface PrivateMessage extends Message {
  receiver_id: string;
}

export interface GroupMessage extends Message {
  group_id: string;
}