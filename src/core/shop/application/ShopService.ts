
import { Shop, ShopItem, ShopSettings, Order, ShopReview } from '../domain/types';
import { shopRepository } from '../infrastructure/ShopRepository';
import { eventBus } from '@/core/event-bus/EventBus';

export const SHOP_EVENTS = {
  SHOP_CREATED: 'shop:created',
  SHOP_UPDATED: 'shop:updated',
  SHOP_ITEM_ADDED: 'shop:item_added',
  SHOP_ITEM_UPDATED: 'shop:item_updated',
  ORDER_CREATED: 'shop:order_created',
  ORDER_STATUS_CHANGED: 'shop:order_status_changed'
};

export class ShopService {
  /**
   * Récupère la boutique d'un utilisateur
   */
  async getUserShop(userId: string): Promise<Shop | null> {
    return shopRepository.getUserShop(userId);
  }

  /**
   * Crée une nouvelle boutique
   */
  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop | null> {
    const shop = await shopRepository.createShop(shopData);
    
    if (shop) {
      eventBus.publish(SHOP_EVENTS.SHOP_CREATED, { shop });
    }
    
    return shop;
  }

  /**
   * Met à jour une boutique
   */
  async updateShop(shopId: string, shopData: Partial<Shop>): Promise<boolean> {
    const success = await shopRepository.updateShop(shopId, shopData);
    
    if (success) {
      eventBus.publish(SHOP_EVENTS.SHOP_UPDATED, { shopId, updates: shopData });
    }
    
    return success;
  }

  /**
   * Récupère toutes les boutiques
   */
  async getAllShops(status?: string): Promise<Shop[]> {
    return shopRepository.getAllShops(status);
  }

  /**
   * Récupère les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return shopRepository.getShopItems(shopId);
  }

  /**
   * Ajoute un article à une boutique
   */
  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    const item = await shopRepository.createShopItem(itemData);
    
    if (item) {
      eventBus.publish(SHOP_EVENTS.SHOP_ITEM_ADDED, { item });
    }
    
    return item;
  }

  /**
   * Récupère les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    return shopRepository.getShopOrders(shopId);
  }

  /**
   * Récupère les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return shopRepository.getShopReviews(shopId);
  }

  /**
   * Récupère les paramètres d'une boutique
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return shopRepository.getShopSettings(shopId);
  }

  /**
   * Vérifie si un utilisateur possède une boutique
   */
  async hasUserShop(userId: string): Promise<boolean> {
    const shop = await this.getUserShop(userId);
    return shop !== null;
  }

  /**
   * Vérifie si un utilisateur est autorisé à accéder à une boutique
   */
  async canUserAccessShop(userId: string, shopId: string): Promise<boolean> {
    const shop = await this.getUserShop(userId);
    return shop !== null && shop.id === shopId;
  }
}

export const shopService = new ShopService();
