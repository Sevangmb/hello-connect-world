
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

// Export ShopStatus enum for type-safety
export enum ShopStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Define NearbyShop interface to replace Store type
export interface NearbyShop {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  logo_url?: string | null;
  banner_url?: string | null;
  status: ShopStatus;
  categories: string[];
  opening_hours: any;
  average_rating: number;
  profiles?: { username: string | null };
  shop_items?: { id: string }[];
}
