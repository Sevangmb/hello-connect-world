
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

  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop> {
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

  async getShopItemsByIds(ids: string[]): Promise<ShopItem[]> {
    return this.repository.getShopItemsByIds(ids);
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    return this.repository.createShopItem(itemData);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return this.repository.updateShopItem(id, itemData);
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem> {
    return this.repository.updateShopItemStatus(id, status);
  }

  async deleteShopItem(id: string): Promise<boolean> {
    return this.repository.deleteShopItem(id);
  }

  // Order operations
  async getOrders(shopId: string): Promise<Order[]> {
    return this.repository.getOrders(shopId);
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    // Implement this in the repository
    const orders = await this.repository.getOrders("");
    return orders.filter(order => order.customer_id === customerId);
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

  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    return this.repository.updateOrderStatus(id, status);
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

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return this.repository.updateShopSettings(shopId, settings);
  }

  // Favorites operations
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.repository.addShopToFavorites(userId, shopId);
  }

  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.repository.removeShopFromFavorites(userId, shopId);
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    return this.repository.isShopFavorited(userId, shopId);
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    return this.repository.getUserFavoriteShops(userId);
  }
}
