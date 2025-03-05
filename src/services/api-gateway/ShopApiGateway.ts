
/**
 * API Gateway pour le Shop Service
 * Sert de façade entre les composants UI et le service de boutique
 */
import { shopService } from '@/core/shop/application/ShopService';
import { Shop, ShopItem, ShopSettings, Order, ShopReview } from '@/core/shop/domain/types';
import { BaseApiGateway } from './BaseApiGateway';

/**
 * Classe qui expose une API claire pour interagir avec le service de boutique
 */
class ShopApiGateway extends BaseApiGateway {
  constructor() {
    super('shop');
  }

  /**
   * Récupère la boutique d'un utilisateur
   */
  async getUserShop(userId: string): Promise<Shop | null> {
    return this.executeOperation('getUserShop', { userId }, async () => {
      return await shopService.getUserShop(userId);
    });
  }

  /**
   * Crée une nouvelle boutique
   */
  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop | null> {
    return this.executeOperation('createShop', { shopData }, async () => {
      return await shopService.createShop(shopData);
    });
  }

  /**
   * Met à jour une boutique
   */
  async updateShop(shopId: string, shopData: Partial<Shop>): Promise<boolean> {
    return this.executeOperation('updateShop', { shopId, shopData }, async () => {
      return await shopService.updateShop(shopId, shopData);
    });
  }

  /**
   * Récupère toutes les boutiques
   */
  async getAllShops(status?: string): Promise<Shop[]> {
    return this.executeOperation('getAllShops', { status }, async () => {
      return await shopService.getAllShops(status);
    });
  }

  /**
   * Récupère les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.executeOperation('getShopItems', { shopId }, async () => {
      return await shopService.getShopItems(shopId);
    });
  }

  /**
   * Ajoute un article à une boutique
   */
  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    return this.executeOperation('createShopItem', { itemData }, async () => {
      return await shopService.createShopItem(itemData);
    });
  }

  /**
   * Récupère les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.executeOperation('getShopOrders', { shopId }, async () => {
      return await shopService.getShopOrders(shopId);
    });
  }

  /**
   * Récupère les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.executeOperation('getShopReviews', { shopId }, async () => {
      return await shopService.getShopReviews(shopId);
    });
  }

  /**
   * Récupère les paramètres d'une boutique
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.executeOperation('getShopSettings', { shopId }, async () => {
      return await shopService.getShopSettings(shopId);
    });
  }

  /**
   * Vérifie si un utilisateur possède une boutique
   */
  async hasUserShop(userId: string): Promise<boolean> {
    return this.executeOperation('hasUserShop', { userId }, async () => {
      return await shopService.hasUserShop(userId);
    });
  }
}

// Exporter une instance unique pour toute l'application
export const shopApiGateway = new ShopApiGateway();
