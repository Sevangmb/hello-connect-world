
import { Outfit, OutfitItem, OutfitStatus, OutfitComment } from '../domain/types';
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';

export class OutfitService {
  private repository: IOutfitRepository;

  constructor(repository: IOutfitRepository) {
    this.repository = repository;
  }

  async getOutfitById(id: string): Promise<Outfit | null> {
    return await this.repository.getOutfitById(id);
  }

  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    return await this.repository.getOutfitItems(outfitId);
  }

  async getUserOutfits(userId: string): Promise<Outfit[]> {
    return await this.repository.getUserOutfits(userId);
  }

  async getPublicOutfits(limit?: number): Promise<Outfit[]> {
    return await this.repository.getPublicOutfits(limit);
  }

  async getTrendingOutfits(limit?: number): Promise<Outfit[]> {
    return await this.repository.getTrendingOutfits(limit);
  }

  async searchOutfits(query: string): Promise<Outfit[]> {
    return await this.repository.searchOutfits(query);
  }

  async createOutfit(outfitData: Partial<Outfit>): Promise<Outfit | null> {
    return await this.repository.createOutfit(outfitData);
  }

  async updateOutfit(id: string, updates: Partial<Outfit>): Promise<Outfit | null> {
    return await this.repository.updateOutfit(id, updates);
  }

  async deleteOutfit(id: string): Promise<boolean> {
    return await this.repository.deleteOutfit(id);
  }

  async updateOutfitStatus(id: string, status: OutfitStatus): Promise<boolean> {
    return await this.repository.updateOutfitStatus(id, status);
  }

  async addOutfitItem(item: Omit<OutfitItem, 'id' | 'created_at'>): Promise<OutfitItem | null> {
    return await this.repository.addOutfitItem(item);
  }

  async updateOutfitItem(id: string, updates: Partial<OutfitItem>): Promise<OutfitItem | null> {
    return await this.repository.updateOutfitItem(id, updates);
  }

  async deleteOutfitItem(id: string): Promise<boolean> {
    return await this.repository.deleteOutfitItem(id);
  }

  async getOutfitComments(outfitId: string): Promise<OutfitComment[]> {
    return await this.repository.getOutfitComments(outfitId);
  }

  async addComment(outfitId: string, userId: string, content: string): Promise<OutfitComment> {
    return await this.repository.addComment(outfitId, userId, content);
  }

  async deleteComment(commentId: string): Promise<boolean> {
    return await this.repository.deleteComment(commentId);
  }

  async likeOutfit(outfitId: string, userId: string): Promise<boolean> {
    return await this.repository.likeOutfit(outfitId, userId);
  }

  async unlikeOutfit(outfitId: string, userId: string): Promise<boolean> {
    return await this.repository.unlikeOutfit(outfitId, userId);
  }

  async isOutfitLikedByUser(outfitId: string, userId: string): Promise<boolean> {
    return await this.repository.isOutfitLikedByUser(outfitId, userId);
  }
}
