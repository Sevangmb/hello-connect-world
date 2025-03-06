
import { ModuleService } from '@/services/modules/ModuleService';
import { getShopServiceInstance } from '@/core/shop/infrastructure/ShopServiceProvider';
import { 
  Shop, ShopItem, ShopStatus, ShopItemStatus, 
  Order, OrderStatus, PaymentStatus, ShopReview
} from '@/core/shop/domain/types';

export class ShopApiGateway {
  private moduleService: ModuleService;
  private shopService: any; // Nous utilisons any temporairement pour éviter les erreurs de type

  constructor() {
    this.moduleService = new ModuleService();
    this.shopService = getShopServiceInstance();
  }

  // Get a shop by ID
  async getShopById(id: string): Promise<Shop | null> {
    return this.shopService.getShopById(id);
  }

  // Get a shop by user ID
  async getUserShop(userId: string): Promise<Shop | null> {
    return this.shopService.getShopByUserId(userId);
  }

  // Get all shops
  async getShops(): Promise<Shop[]> {
    return this.shopService.getAllShops();
  }

  // Create a new shop
  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
    return this.shopService.createShop(shop);
  }

  // Update a shop
  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null> {
    return this.shopService.updateShop(id, shop);
  }

  // Get shops by status
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    return this.shopService.getShopsByStatus(status);
  }

  // Add items to a shop
  async createShopItem(shopId: string, items: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>[]): Promise<ShopItem[]> {
    return this.shopService.addShopItems(shopId, items);
  }

  // Get shop items
  async getShopItemsById(shopId: string): Promise<ShopItem[]> {
    return this.shopService.getShopItems(shopId);
  }

  // Update shop item
  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopService.updateShopItem(id, item);
  }

  // Update shop item status
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem | null> {
    return this.shopService.updateShopItemStatus(id, status);
  }

  // Get shop item by ID
  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopService.getShopItemById(id);
  }

  // Get shop reviews
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopService.getShopReviews(shopId);
  }

  // Add a review to a shop
  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> {
    return this.shopService.createShopReview(review);
  }

  // Get orders for a shop
  async getOrdersForShop(shopId: string): Promise<Order[]> {
    return this.shopService.getOrdersByShop(shopId);
  }

  // Get orders for a customer
  async getOrdersForCustomer(customerId: string): Promise<Order[]> {
    return this.shopService.getOrdersByCustomer(customerId);
  }

  // Get an order by ID
  async getOrderById(id: string): Promise<Order | null> {
    return this.shopService.getOrderById(id);
  }

  // Update order status
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    return this.shopService.updateOrderStatus(id, status);
  }

  // Check if a user has favorited a shop
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    return this.shopService.isShopFavorited(userId, shopId);
  }

  // Add a shop to favorites
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopService.addShopToFavorites(userId, shopId);
  }

  // Remove a shop from favorites
  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopService.removeShopFromFavorites(userId, shopId);
  }

  // Get user's favorite shops
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return this.shopService.getFavoriteShops(userId);
  }
}
