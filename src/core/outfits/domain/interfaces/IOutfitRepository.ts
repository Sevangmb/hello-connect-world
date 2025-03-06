
import { Outfit } from '../types';
import { OutfitItem } from '../../infrastructure/OutfitRepository';

export interface IOutfitRepository {
  createOutfit(outfit: Partial<Outfit>): Promise<Outfit>;
  getOutfitById(id: string): Promise<Outfit | null>;
  getUserOutfits(userId: string): Promise<Outfit[]>;
  updateOutfit(id: string, outfit: Partial<Outfit>): Promise<Outfit>;
  deleteOutfit(id: string): Promise<boolean>;
  
  likeOutfit(outfitId: string, userId: string): Promise<boolean>;
  unlikeOutfit(outfitId: string, userId: string): Promise<boolean>;
  isOutfitLikedByUser(outfitId: string, userId: string): Promise<boolean>;
  
  addOutfitItem(outfitItem: OutfitItem): Promise<OutfitItem>;
  removeOutfitItem(itemId: string): Promise<boolean>;
  getOutfitItems(outfitId: string): Promise<OutfitItem[]>;
  
  getFeaturedOutfits(): Promise<Outfit[]>;
  getTrendingOutfits(): Promise<Outfit[]>;
  getSimilarOutfits(outfitId: string): Promise<Outfit[]>;
  
  searchOutfits(query: string): Promise<Outfit[]>;
}
