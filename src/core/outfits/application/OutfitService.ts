
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';
import { Outfit, OutfitComment, OutfitItem } from '../domain/types';

export class OutfitService {
  private outfitRepository: IOutfitRepository;

  constructor(outfitRepository: IOutfitRepository) {
    this.outfitRepository = outfitRepository;
  }

  /**
   * Get all outfits
   */
  async getAllOutfits(): Promise<Outfit[]> {
    return this.outfitRepository.getAllOutfits();
  }

  /**
   * Get outfit by ID
   */
  async getOutfitById(id: string): Promise<Outfit | null> {
    return this.outfitRepository.getOutfitById(id);
  }

  /**
   * Create a new outfit
   */
  async createOutfit(outfit: Partial<Outfit>): Promise<Outfit | null> {
    return this.outfitRepository.createOutfit(outfit);
  }

  /**
   * Update an existing outfit
   */
  async updateOutfit(id: string, outfit: Partial<Outfit>): Promise<Outfit | null> {
    return this.outfitRepository.updateOutfit(id, outfit);
  }

  /**
   * Delete an outfit
   */
  async deleteOutfit(id: string): Promise<boolean> {
    return this.outfitRepository.deleteOutfit(id);
  }

  /**
   * Add an item to an outfit
   */
  async addOutfitItem(outfitItem: OutfitItem): Promise<OutfitItem | null> {
    return this.outfitRepository.addOutfitItem(outfitItem);
  }

  /**
   * Get items for an outfit
   */
  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    return this.outfitRepository.getOutfitItems(outfitId);
  }

  /**
   * Remove an item from an outfit
   */
  async removeOutfitItem(itemId: string): Promise<boolean> {
    return this.outfitRepository.removeOutfitItem(itemId);
  }

  /**
   * Get outfits by user ID
   */
  async getOutfitsByUserId(userId: string): Promise<Outfit[]> {
    return this.outfitRepository.getOutfitsByUserId(userId);
  }

  /**
   * Get public outfits
   */
  async getPublicOutfits(): Promise<Outfit[]> {
    return this.outfitRepository.getPublicOutfits();
  }

  /**
   * Get trending outfits
   */
  async getTrendingOutfits(): Promise<Outfit[]> {
    return this.outfitRepository.getTrendingOutfits();
  }

  /**
   * Search outfits
   */
  async searchOutfits(query: string): Promise<Outfit[]> {
    return this.outfitRepository.searchOutfits(query);
  }

  /**
   * Like an outfit
   */
  async likeOutfit(outfitId: string, userId: string): Promise<boolean> {
    return this.outfitRepository.likeOutfit(outfitId, userId);
  }

  /**
   * Unlike an outfit
   */
  async unlikeOutfit(outfitId: string, userId: string): Promise<boolean> {
    return this.outfitRepository.unlikeOutfit(outfitId, userId);
  }

  /**
   * Check if user has liked an outfit
   */
  async hasUserLikedOutfit(outfitId: string, userId: string): Promise<boolean> {
    return this.outfitRepository.hasUserLikedOutfit(outfitId, userId);
  }

  /**
   * Add a comment to an outfit
   */
  async addOutfitComment(outfitId: string, userId: string, content: string): Promise<OutfitComment | null> {
    return this.outfitRepository.addOutfitComment(outfitId, userId, content);
  }

  /**
   * Get comments for an outfit
   */
  async getOutfitComments(outfitId: string): Promise<OutfitComment[]> {
    return this.outfitRepository.getOutfitComments(outfitId);
  }
}
