
import { Outfit, OutfitItem, OutfitComment } from '../types';

export interface IOutfitRepository {
  createOutfit(outfitData: Partial<Outfit>): Promise<Outfit>;
  getOutfitById(id: string): Promise<Outfit | null>;
  getUserOutfits(userId: string): Promise<Outfit[]>;
  updateOutfit(id: string, outfitData: Partial<Outfit>): Promise<Outfit>;
  deleteOutfit(id: string): Promise<boolean>;
  
  likeOutfit(outfitId: string, userId: string): Promise<boolean>;
  unlikeOutfit(outfitId: string, userId: string): Promise<boolean>;
  hasUserLikedOutfit(outfitId: string, userId: string): Promise<boolean>;
  
  addOutfitItem(outfitItem: OutfitItem): Promise<OutfitItem>;
  removeOutfitItem(itemId: string): Promise<boolean>;
  getOutfitItems(outfitId: string): Promise<OutfitItem[]>;
  
  getFeaturedOutfits(): Promise<Outfit[]>;
  getTrendingOutfits(): Promise<Outfit[]>;
  getSimilarOutfits(outfitId: string): Promise<Outfit[]>;
  
  searchOutfits(query: string): Promise<Outfit[]>;
  
  getAllOutfits(): Promise<Outfit[]>;
  getOutfitsByUserId(userId: string): Promise<Outfit[]>;
  getPublicOutfits(): Promise<Outfit[]>;
  addOutfitComment(outfitId: string, userId: string, content: string): Promise<OutfitComment | null>;
  getOutfitComments(outfitId: string): Promise<OutfitComment[]>;
}
