
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  Order, 
  ShopStatus, 
  ShopItemStatus,
  OrderStatus, 
  ShopSettings,
  PaymentStatus
} from '../domain/types';

export class ShopService {
  private repository: IShopRepository;

  constructor(repository: IShopRepository) {
    this.repository = repository;
  }

  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    return this.repository.getShopById(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.repository.getShopByUserId(userId);
  }

  async getShops(): Promise<Shop[]> {
    return this.repository.getShops();
  }

  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    return this.repository.getShopsByStatus(status);
  }

  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop> {
    return this.repository.createShop(shopData);
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    return this.repository.updateShop(id, shopData);
  }

  async deleteShop(id: string): Promise<boolean> {
    return this.repository.deleteShop(id);
  }

  // Shop item operations
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.repository.getShopItems(shopId);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.repository.getShopItemById(id);
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    return this.repository.createShopItem(itemData);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return this.repository.updateShopItem(id, itemData);
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    return this.repository.updateShopItemStatus(id, status);
  }

  async deleteShopItem(id: string): Promise<boolean> {
    return this.repository.deleteShopItem(id);
  }

  // Order operations
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.repository.getShopOrders(shopId);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.repository.getUserOrders(userId);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.repository.getOrderById(id);
  }

  async createOrder(orderData: any): Promise<Order> {
    return this.repository.createOrder(orderData);
  }

  async updateOrder(id: string, orderData: any): Promise<Order> {
    return this.repository.updateOrder(id, orderData);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return this.repository.updateOrderStatus(orderId, status);
  }

  // Shop review operations
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.repository.getShopReviews(shopId);
  }

  async createShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
    return this.repository.createShopReview(review);
  }

  async updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview> {
    return this.repository.updateShopReview(id, reviewData);
  }

  async deleteShopReview(id: string): Promise<boolean> {
    return this.repository.deleteShopReview(id);
  }

  // Shop settings operations
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.repository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    return this.repository.updateShopSettings(shopId, settings);
  }

  // Favorites operations
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return this.repository.getFavoriteShops(userId);
  }

  async addFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return this.repository.addFavoriteShop(userId, shopId);
  }

  async removeFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return this.repository.removeFavoriteShop(userId, shopId);
  }

  async checkIfFavorited(userId: string, shopId: string): Promise<boolean> {
    return this.repository.checkIfFavorited(userId, shopId);
  }
}
