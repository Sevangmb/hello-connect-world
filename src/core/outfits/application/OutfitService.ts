
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';
import { Outfit, OutfitComment, OutfitItem, OutfitStatus } from '../domain/types';

export class OutfitService {
  private outfitRepository: IOutfitRepository;

  constructor(outfitRepository: IOutfitRepository) {
    this.outfitRepository = outfitRepository;
  }

  async getOutfitById(id: string): Promise<Outfit | null> {
    return this.outfitRepository.getOutfitById(id);
  }

  async getUserOutfits(userId: string): Promise<Outfit[]> {
    return this.outfitRepository.getOutfitsByUserId(userId);
  }

  async getPublicOutfits(limit?: number): Promise<Outfit[]> {
    return this.outfitRepository.getPublicOutfits(limit);
  }

  async getTrendingOutfits(limit?: number): Promise<Outfit[]> {
    return this.outfitRepository.getTrendingOutfits(limit);
  }

  async searchOutfits(query: string): Promise<Outfit[]> {
    return this.outfitRepository.searchOutfits(query);
  }

  async createOutfit(outfitData: Partial<Outfit>): Promise<Outfit> {
    return this.outfitRepository.createOutfit(outfitData);
  }

  async updateOutfit(id: string, outfitData: Partial<Outfit>): Promise<Outfit> {
    return this.outfitRepository.updateOutfit(id, outfitData);
  }

  async deleteOutfit(id: string): Promise<boolean> {
    return this.outfitRepository.deleteOutfit(id);
  }

  async publishOutfit(id: string): Promise<boolean> {
    return this.outfitRepository.updateOutfitStatus(id, 'published');
  }

  async archiveOutfit(id: string): Promise<boolean> {
    return this.outfitRepository.updateOutfitStatus(id, 'archived');
  }

  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    return this.outfitRepository.getOutfitItems(outfitId);
  }

  async addClothesToOutfit(outfitId: string, clothesId: string, position: number): Promise<OutfitItem> {
    return this.outfitRepository.addOutfitItem({
      outfit_id: outfitId,
      clothes_id: clothesId,
      position
    });
  }

  async removeClothesFromOutfit(itemId: string): Promise<boolean> {
    return this.outfitRepository.removeOutfitItem(itemId);
  }

  async updateItemPosition(itemId: string, newPosition: number): Promise<OutfitItem> {
    return this.outfitRepository.updateOutfitItem(itemId, { position: newPosition });
  }

  async getOutfitComments(outfitId: string): Promise<OutfitComment[]> {
    return this.outfitRepository.getOutfitComments(outfitId);
  }

  async addComment(outfitId: string, userId: string, content: string): Promise<OutfitComment> {
    return this.outfitRepository.addComment(outfitId, userId, content);
  }

  async deleteComment(commentId: string): Promise<boolean> {
    return this.outfitRepository.deleteComment(commentId);
  }

  async likeOutfit(outfitId: string, userId: string): Promise<boolean> {
    return this.outfitRepository.likeOutfit(outfitId, userId);
  }

  async unlikeOutfit(outfitId: string, userId: string): Promise<boolean> {
    return this.outfitRepository.unlikeOutfit(outfitId, userId);
  }

  async isOutfitLikedByUser(outfitId: string, userId: string): Promise<boolean> {
    return this.outfitRepository.isOutfitLikedByUser(outfitId, userId);
  }
}
