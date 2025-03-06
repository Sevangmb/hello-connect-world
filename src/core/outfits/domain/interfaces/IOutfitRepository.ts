
import { Outfit, OutfitItem, OutfitStatus, OutfitCategory, OutfitSeason, OutfitComment } from '../types';

export interface IOutfitRepository {
  getOutfitById(id: string): Promise<Outfit | null>;
  getOutfitItems(outfitId: string): Promise<OutfitItem[]>;
  createOutfit(outfit: Partial<Outfit>): Promise<Outfit | null>;
  updateOutfit(id: string, updates: Partial<Outfit>): Promise<Outfit | null>;
  deleteOutfit(id: string): Promise<boolean>;
  getUserOutfits(userId: string): Promise<Outfit[]>;
  addOutfitItem(outfitItem: Omit<OutfitItem, 'id' | 'created_at'>): Promise<OutfitItem | null>;
  updateOutfitItem(id: string, updates: Partial<OutfitItem>): Promise<OutfitItem | null>;
  deleteOutfitItem(id: string): Promise<boolean>;
  
  // Méthodes supplémentaires qui doivent être implémentées
  getOutfitsByUserId(userId: string): Promise<Outfit[]>;
  getPublicOutfits(limit?: number): Promise<Outfit[]>;
  getTrendingOutfits(limit?: number): Promise<Outfit[]>;
  searchOutfits(query: string): Promise<Outfit[]>;
  updateOutfitStatus(id: string, status: OutfitStatus): Promise<boolean>;
  
  // Méthodes pour les interactions sociales
  getOutfitComments(outfitId: string): Promise<OutfitComment[]>;
  addComment(outfitId: string, userId: string, content: string): Promise<OutfitComment>;
  deleteComment(commentId: string): Promise<boolean>;
  likeOutfit(outfitId: string, userId: string): Promise<boolean>;
  unlikeOutfit(outfitId: string, userId: string): Promise<boolean>;
  isOutfitLikedByUser(outfitId: string, userId: string): Promise<boolean>;
}
