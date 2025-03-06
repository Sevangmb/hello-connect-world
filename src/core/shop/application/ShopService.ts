
import { Shop, ShopItem, ShopReview, ShopSettings, CartItem, Order, OrderStatus, ShopItemStatus } from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopService {
  private shopRepository: IShopRepository;

  constructor(shopRepository: IShopRepository) {
    this.shopRepository = shopRepository;
  }

  // Shop management
  async getShopById(id: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopRepository.getShopByUserId(userId);
  }
  
  async getShopsByStatus(status: ShopItemStatus): Promise<Shop[]> {
    return this.shopRepository.getShopsByStatus(status);
  }

  async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.createShop(shopData);
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.updateShop(id, shopData);
  }

  // Shop items management
  async getAllShopItems(): Promise<ShopItem[]> {
    return this.shopRepository.getAllShopItems();
  }
  
  async getShopItems(): Promise<ShopItem[]> {
    return this.shopRepository.getShopItems();
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    return this.shopRepository.getShopItemsByShopId(shopId);
  }

  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopRepository.createShopItem(itemData);
  }
  
  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    return this.shopRepository.addShopItems(items);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopRepository.updateShopItem(id, itemData);
  }
  
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem | null> {
    return this.shopRepository.updateShopItemStatus(id, status);
  }

  async deleteShopItem(id: string): Promise<boolean> {
    return this.shopRepository.deleteShopItem(id);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopRepository.getShopItemById(id);
  }

  // Shop reviews
  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviewsByShopId(shopId);
  }
  
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviews(shopId);
  }

  async createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null> {
    return this.shopRepository.createShopReview(reviewData);
  }

  // Shop settings
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return this.shopRepository.updateShopSettings(shopId, settingsData);
  }
  
  // Orders
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.shopRepository.getShopOrders(shopId);
  }
  
  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    return this.shopRepository.createOrder(orderData);
  }
  
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return this.shopRepository.updateOrderStatus(orderId, status);
  }
  
  // Favorites
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return this.shopRepository.getFavoriteShops(userId);
  }
  
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.isShopFavorited(userId, shopId);
  }
  
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.addShopToFavorites(userId, shopId);
  }
  
  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.removeShopFromFavorites(userId, shopId);
  }
  
  // Cart
  async addToCart(userId: string, itemId: string, shopId: string, quantity: number): Promise<CartItem | null> {
    return this.shopRepository.addToCart(userId, itemId, shopId, quantity);
  }
}
