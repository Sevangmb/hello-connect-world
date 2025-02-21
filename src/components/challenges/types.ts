
export type ClothingItem = {
  name: string;
  image_url: string | null;
};

export type Outfit = {
  name: string;
  top: ClothingItem | null;
  bottom: ClothingItem | null;
  shoes: ClothingItem | null;
};

export type Participant = {
  id: string;
  user_id: string;
  outfit_id: string | null;
  comment: string | null;
  outfits: Outfit | null;
  profiles: { username: string | null };
  moderated_at: string | null;
  moderated_by: string | null;
  moderation_status: string | null;
  moderation_reason: string | null;
};

export type Challenge = {
  id: string;
  title: string;
  description: string | null;
  rules: string | null;
  reward_description: string | null;
  start_date: string;
  end_date: string;
  creator_id: string;
  status: 'active' | 'completed';
  profiles: { username: string | null };
  participants: Participant[];
  votes: { count: number }[];
  participation_type: 'virtual' | 'photo';
  is_voting_enabled: boolean;
  hashtags?: { hashtags: { name: string } }[];
};
