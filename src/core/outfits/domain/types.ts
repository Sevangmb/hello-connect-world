
export type OutfitStatus = 'draft' | 'published' | 'archived';
export type OutfitCategory = 'casual' | 'formal' | 'sport' | 'other';
export type OutfitSeason = 'spring' | 'summer' | 'fall' | 'winter' | 'all';

export interface OutfitItem {
  id: string;
  outfit_id: string;
  clothes_id: string;
  position: number;
  created_at: string;
}

export interface Outfit {
  id: string;
  user_id: string;
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
  created_at: string;
  updated_at: string;
}
