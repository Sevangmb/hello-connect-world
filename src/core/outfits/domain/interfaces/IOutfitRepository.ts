
import { Outfit, OutfitComment, OutfitItem } from '../types';

export interface IOutfitRepository {
  getAllOutfits(): Promise<Outfit[]>;
  getOutfitById(id: string): Promise<Outfit | null>;
  createOutfit(outfit: Partial<Outfit>): Promise<Outfit | null>;
  updateOutfit(id: string, outfit: Partial<Outfit>): Promise<Outfit | null>;
  deleteOutfit(id: string): Promise<boolean>;
  addOutfitItem(outfitItem: OutfitItem): Promise<OutfitItem | null>;
  getOutfitItems(outfitId: string): Promise<OutfitItem[]>;
  removeOutfitItem(outfitId: string, clothesId: string): Promise<boolean>;
  getOutfitsByUserId(userId: string): Promise<Outfit[]>;
  getPublicOutfits(): Promise<Outfit[]>;
  getTrendingOutfits(): Promise<Outfit[]>;
  searchOutfits(query: string): Promise<Outfit[]>;
  likeOutfit(outfitId: string, userId: string): Promise<boolean>;
  unlikeOutfit(outfitId: string, userId: string): Promise<boolean>;
  hasUserLikedOutfit(outfitId: string, userId: string): Promise<boolean>;
  addOutfitComment(outfitId: string, userId: string, content: string): Promise<OutfitComment | null>;
  getOutfitComments(outfitId: string): Promise<OutfitComment[]>;
}
