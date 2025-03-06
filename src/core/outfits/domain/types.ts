
/**
 * Types pour le module de gestion des tenues
 */

export type OutfitStatus = 'draft' | 'published' | 'private' | 'archived';
export type OutfitCategory = 'casual' | 'formal' | 'sport' | 'beach' | 'winter' | 'work' | 'other';
export type OutfitSeason = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';

export interface OutfitItem {
  id: string;
  outfit_id: string;
  clothes_id: string;
  position: number;
  created_at: string;
  clothes?: {
    id: string;
    name: string;
    image_url?: string;
    category: string;
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
  tags?: string[];
  image_url?: string;
  is_favorite: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  
  // Champs compatibles avec la DB
  top_id?: string;
  bottom_id?: string;
  shoes_id?: string;
  
  items?: OutfitItem[];
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

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

export interface OutfitLike {
  id: string;
  outfit_id: string;
  user_id: string;
  created_at: string;
}

// Type for database records
export interface DbOutfit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status?: string;
  category?: string;
  season?: string;
  top_id?: string;
  bottom_id?: string;
  shoes_id?: string;
  is_favorite?: boolean;
  likes_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
  items?: any[];
}
