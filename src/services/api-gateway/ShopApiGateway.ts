
import { Shop, ShopItem, ShopStatus, ShopItemStatus, Order, ShopReview } from '@/core/shop/domain/types';
import { ModuleService } from '@/services/modules/ModuleService';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';

// Create a singleton instance
let moduleServiceInstance: ModuleService | null = null;

export class ShopApiGateway {
  constructor() {
    if (!moduleServiceInstance) {
      moduleServiceInstance = new ModuleService();
    }
  }

  // Shop operations
  async getAllShops(): Promise<Shop[]> {
    try {
      return await shopService.getShopsByStatus('approved' as ShopStatus);
    } catch (error) {
      console.error("Error getting all shops:", error);
      return [];
    }
  }

  async getShopById(id: string): Promise<Shop | null> {
    try {
      return await shopService.getShopById(id);
    } catch (error) {
      console.error("Error getting shop by ID:", error);
      return null;
    }
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      return await shopService.getShopByUserId(userId);
    } catch (error) {
      console.error("Error getting shop by user ID:", error);
      return null;
    }
  }

  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
    try {
      return await shopService.createShop(shop);
    } catch (error) {
      console.error("Error creating shop:", error);
      return null;
    }
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      return await shopService.updateShop(id, shopData);
    } catch (error) {
      console.error("Error updating shop:", error);
      return null;
    }
  }

  // Shop item operations
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      return await shopService.getShopItems(shopId);
    } catch (error) {
      console.error("Error getting shop items:", error);
      return [];
    }
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      return await shopService.getShopItemById(id);
    } catch (error) {
      console.error("Error getting shop item by ID:", error);
      return null;
    }
  }

  async addShopItems(shopId: string, items: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    try {
      return await shopService.addShopItems(shopId, items);
    } catch (error) {
      console.error("Error adding shop items:", error);
      return false;
    }
  }

  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      return await shopService.updateShopItem(id, item);
    } catch (error) {
      console.error("Error updating shop item:", error);
      return null;
    }
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    try {
      return await shopService.updateShopItemStatus(id, status);
    } catch (error) {
      console.error("Error updating shop item status:", error);
      return false;
    }
  }

  // Shop reviews operations
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      return await shopService.getShopReviews(shopId);
    } catch (error) {
      console.error("Error getting shop reviews:", error);
      return [];
    }
  }

  // Order operations
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      return await shopService.getShopOrders(shopId);
    } catch (error) {
      console.error("Error getting shop orders:", error);
      return [];
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    try {
      // Fallback implementation if service doesn't have this method
      return [];
    } catch (error) {
      console.error("Error getting customer orders:", error);
      return [];
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      // Fallback implementation if service doesn't have this method
      return null;
    } catch (error) {
      console.error("Error getting order by ID:", error);
      return null;
    }
  }

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    try {
      return await shopService.createOrder(order);
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      return await shopService.updateOrderStatus(orderId, status as any);
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  }

  // Favorites operations
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      return await shopService.getFavoriteShops(userId);
    } catch (error) {
      console.error("Error getting favorite shops:", error);
      return [];
    }
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    try {
      return await shopService.isShopFavorited(userId, shopId);
    } catch (error) {
      console.error("Error checking if shop is favorited:", error);
      return false;
    }
  }

  async addToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      return await shopService.addShopToFavorites(userId, shopId);
    } catch (error) {
      console.error("Error adding shop to favorites:", error);
      return false;
    }
  }

  async removeFromFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      return await shopService.removeShopFromFavorites(userId, shopId);
    } catch (error) {
      console.error("Error removing shop from favorites:", error);
      return false;
    }
  }

  // Cart operations
  async getCart(userId: string): Promise<any[]> {
    try {
      // Implement when needed
      return [];
    } catch (error) {
      console.error("Error getting cart:", error);
      return [];
    }
  }

  async addToCart(userId: string, itemId: string, quantity: number): Promise<boolean> {
    try {
      return await shopService.addToCart(userId, itemId, quantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  }

  async removeFromCart(userId: string, itemId: string): Promise<boolean> {
    try {
      // Implement when needed
      return false;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  }

  async clearCart(userId: string): Promise<boolean> {
    try {
      // Implement when needed
      return false;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  }

  // Module methods
  async initialize(): Promise<boolean> {
    return true;
  }
}

// Export a singleton instance
export const shopApiGateway = new ShopApiGateway();
