
import { OutfitStatus, OutfitCategory, OutfitSeason } from '../domain/types';

export interface InfraOutfitItem {
  id?: string;
  outfit_id: string;
  clothes_id: string;
  position: number;
  created_at?: string;
  type?: string;
}

export interface InfraOutfit {
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
