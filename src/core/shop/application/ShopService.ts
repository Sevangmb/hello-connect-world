
import { Shop, ShopItem, ShopStatus, Order, ShopReview } from "../domain/types";
import { ShopRepository } from "../infrastructure/ShopRepository";

/**
 * Service pour la gestion des boutiques
 * Implémente les cas d'usage liés aux boutiques
 */
export class ShopService {
  private shopRepository: ShopRepository;
  
  constructor(shopRepository: ShopRepository) {
    this.shopRepository = shopRepository;
  }
  
  /**
   * Récupère la boutique d'un utilisateur
   */
  async getUserShop(userId: string): Promise<Shop | null> {
    return this.shopRepository.getUserShop(userId);
  }
  
  /**
   * Récupère une boutique par son ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(id);
  }
  
  /**
   * Récupère toutes les boutiques
   */
  async getAllShops(): Promise<Shop[]> {
    return this.shopRepository.getAllShops();
  }
  
  /**
   * Met à jour une boutique
   */
  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.updateShop(id, shop);
  }
  
  /**
   * Crée une nouvelle boutique
   */
  async createShop(shop: Omit<Shop, "id" | "created_at" | "updated_at" | "average_rating">): Promise<Shop> {
    return this.shopRepository.createShop(shop);
  }
  
  /**
   * Récupère les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopRepository.getShopItems(shopId);
  }
  
  /**
   * Crée un nouvel article
   */
  async createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem> {
    return this.shopRepository.createShopItem(item);
  }
  
  /**
   * Récupère les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.shopRepository.getShopOrders(shopId);
  }
  
  /**
   * Récupère les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviews(shopId);
  }
  
  /**
   * Met à jour le statut d'une boutique
   */
  async updateShopStatus(id: string, status: ShopStatus): Promise<Shop> {
    return this.shopRepository.updateShopStatus(id, status);
  }
}
