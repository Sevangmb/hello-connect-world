
// Define the possible outfit status values
export type OutfitStatus = 'draft' | 'published' | 'archived';

// Define the possible outfit category values
export type OutfitCategory = 'casual' | 'formal' | 'business' | 'sport' | 'evening' | 'other';

// Define the possible outfit season values
export type OutfitSeason = 'spring' | 'summer' | 'fall' | 'winter' | 'all';

// Define the outfit interface
export interface Outfit {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;
  top_id?: string;
  bottom_id?: string;
  shoes_id?: string;
  status: OutfitStatus;
  category: OutfitCategory;
  season: OutfitSeason;
  is_favorite: boolean;
  likes_count: number;
  comments_count: number;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

// Define the outfit comment interface
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

// Define the outfit item interface
export interface OutfitItem {
  id?: string;
  outfit_id: string;
  clothes_id: string;
  position: number;
  created_at?: string;
  type?: string;
}

export interface OutfitRepositoryData {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;
  top_id?: string;
  bottom_id?: string;
  shoes_id?: string;
  status: string;
  category: string;
  season: string;
  is_favorite: boolean;
  likes_count: number;
  comments_count: number;
  created_at?: string;
  updated_at?: string;
}
