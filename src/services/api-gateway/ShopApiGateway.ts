
import { ModuleService } from '@/services/modules/ModuleService';
import { ShopService } from '@/core/shop/application/ShopService';
import { ShopRepository } from '@/core/shop/infrastructure/ShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  Order, 
  ShopItemStatus, 
  ShopStatus,
  PaymentMethod,
  OrderStatus,
  PaymentStatus
} from '@/core/shop/domain/types';

export class ShopApiGateway {
  private shopService: ShopService;

  constructor() {
    const shopRepository = new ShopRepository();
    this.shopService = new ShopService(shopRepository);
  }

  async getShopById(shopId: string): Promise<Shop | null> {
    return this.shopService.getShopById(shopId);
  }

  async getUserShop(userId: string): Promise<Shop | null> {
    return this.shopService.getUserShop(userId);
  }

  async getShops(): Promise<Shop[]> {
    if (typeof this.shopService.getShops === 'function') {
      return this.shopService.getShops();
    }
    return [];
  }

  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    if (typeof this.shopService.getShopsByStatus === 'function') {
      return this.shopService.getShopsByStatus(status);
    }
    return [];
  }

  async createShop(userId: string, shop: Partial<Shop>): Promise<Shop | null> {
    return this.shopService.createShop(userId, shop);
  }

  async updateShop(id: string, data: Partial<Shop>): Promise<Shop | null> {
    return this.shopService.updateShop(id, data);
  }

  async updateShopItemStatus(itemId: string, status: ShopItemStatus): Promise<boolean> {
    if (typeof this.shopService.updateShopItemStatus === 'function') {
      return this.shopService.updateShopItemStatus(itemId, status);
    }
    return false;
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    if (typeof this.shopService.getShopReviews === 'function') {
      return this.shopService.getShopReviews(shopId);
    }
    return [];
  }

  async createReview(userId: string, shopId: string, review: Partial<ShopReview>): Promise<ShopReview | null> {
    if (typeof this.shopService.createShopReview === 'function') {
      return this.shopService.createShopReview(userId, shopId, review);
    }
    return null;
  }

  async getOrdersByShop(shopId: string): Promise<Order[]> {
    if (typeof this.shopService.getOrdersByShop === 'function') {
      return this.shopService.getOrdersByShop(shopId);
    }
    return [];
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    if (typeof this.shopService.getOrdersByCustomer === 'function') {
      return this.shopService.getOrdersByCustomer(customerId);
    }
    return [];
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    if (typeof this.shopService.getOrderById === 'function') {
      return this.shopService.getOrderById(orderId);
    }
    return null;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    if (typeof this.shopService.updateOrderStatus === 'function') {
      return this.shopService.updateOrderStatus(orderId, status);
    }
    return false;
  }

  async getShopSettings(shopId: string): Promise<any> {
    if (typeof this.shopService.getShopSettings === 'function') {
      return this.shopService.getShopSettings(shopId);
    }
    return null;
  }

  async updateShopSettings(shopId: string, settings: any): Promise<boolean> {
    if (typeof this.shopService.updateShopSettings === 'function') {
      return this.shopService.updateShopSettings(shopId, settings);
    }
    return false;
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    if (typeof this.shopService.getFavoriteShops === 'function') {
      return this.shopService.getFavoriteShops(userId);
    }
    return [];
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    if (typeof this.shopService.isShopFavorited === 'function') {
      return this.shopService.isShopFavorited(userId, shopId);
    }
    return false;
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    if (typeof this.shopService.addShopToFavorites === 'function') {
      return this.shopService.addShopToFavorites(userId, shopId);
    }
    return false;
  }

  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    if (typeof this.shopService.removeShopFromFavorites === 'function') {
      return this.shopService.removeShopFromFavorites(userId, shopId);
    }
    return false;
  }
}

// Export a singleton instance
export const shopApiGateway = new ShopApiGateway();
