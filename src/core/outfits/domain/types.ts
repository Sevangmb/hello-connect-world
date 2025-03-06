
export type OutfitCategory = 'casual' | 'formal' | 'sport' | 'business' | 'other';
export type OutfitSeason = 'spring' | 'summer' | 'fall' | 'winter' | 'all';
export type OutfitStatus = 'draft' | 'published' | 'archived';

export interface OutfitComment {
  id: string;
  outfit_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: OutfitStatus;
  category: OutfitCategory; 
  season: OutfitSeason;
  is_favorite: boolean;
  top_id?: string;
  bottom_id?: string;
  shoes_id?: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}
