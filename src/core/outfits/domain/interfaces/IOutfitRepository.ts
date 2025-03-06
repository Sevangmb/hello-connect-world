
import { Outfit, OutfitComment, OutfitItem, OutfitStatus } from '../types';

export interface IOutfitRepository {
  // Opérations pour les tenues
  getOutfitById(id: string): Promise<Outfit | null>;
  getOutfitsByUserId(userId: string): Promise<Outfit[]>;
  getPublicOutfits(limit?: number): Promise<Outfit[]>;
  getTrendingOutfits(limit?: number): Promise<Outfit[]>;
  searchOutfits(query: string): Promise<Outfit[]>;
  createOutfit(outfit: Partial<Outfit>): Promise<Outfit>;
  updateOutfit(id: string, outfitData: Partial<Outfit>): Promise<Outfit>;
  updateOutfitStatus(id: string, status: OutfitStatus): Promise<boolean>;
  deleteOutfit(id: string): Promise<boolean>;
  
  // Opérations pour les éléments de tenue
  getOutfitItems(outfitId: string): Promise<OutfitItem[]>;
  addOutfitItem(item: Partial<OutfitItem>): Promise<OutfitItem>;
  updateOutfitItem(id: string, itemData: Partial<OutfitItem>): Promise<OutfitItem>;
  removeOutfitItem(id: string): Promise<boolean>;
  
  // Interactions sociales
  getOutfitComments(outfitId: string): Promise<OutfitComment[]>;
  addComment(outfitId: string, userId: string, content: string): Promise<OutfitComment>;
  deleteComment(commentId: string): Promise<boolean>;
  likeOutfit(outfitId: string, userId: string): Promise<boolean>;
  unlikeOutfit(outfitId: string, userId: string): Promise<boolean>;
  isOutfitLikedByUser(outfitId: string, userId: string): Promise<boolean>;
}
