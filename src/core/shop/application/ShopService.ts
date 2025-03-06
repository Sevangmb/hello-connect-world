
import { 
  Shop, 
  ShopItem, 
  ShopStatus, 
  ShopItemStatus, 
  Order, 
  ShopReview,
  OrderStatus,
  PaymentStatus
} from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopService {
  private shopRepository: IShopRepository;

  constructor(shopRepository: IShopRepository) {
    this.shopRepository = shopRepository;
  }

  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopRepository.getShopByUserId(userId);
  }

  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
    return this.shopRepository.createShop(shop);
  }

  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.updateShop(id, shop);
  }

  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    return this.shopRepository.getShopsByStatus(status);
  }

  // Shop items operations
  async addShopItems(shopId: string, items: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    return this.shopRepository.addShopItems(shopId, items);
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopRepository.getShopItems(shopId);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopRepository.getShopItemById(id);
  }

  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopRepository.updateShopItem(id, item);
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    return this.shopRepository.updateShopItemStatus(id, status);
  }

  // Order operations
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.shopRepository.getShopOrders(shopId);
  }

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    return this.shopRepository.createOrder(order);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return this.shopRepository.updateOrderStatus(orderId, status);
  }

  // Favorites operations
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.isShopFavorited(userId, shopId);
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.addShopToFavorites(userId, shopId);
  }

  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.removeShopFromFavorites(userId, shopId);
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return this.shopRepository.getFavoriteShops(userId);
  }

  // Shop reviews
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviews(shopId);
  }

  // Cart operations
  async addToCart(userId: string, itemId: string, quantity: number): Promise<boolean> {
    return this.shopRepository.addToCart(userId, itemId, quantity);
  }
}
