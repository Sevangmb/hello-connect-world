
import { ShopRepository } from '../infrastructure/ShopRepository';
import { Shop, ShopItem, ShopReview, ShopSettings, Order, OrderStatus, ShopStatus } from '../domain/types';

export class ShopService {
  private shopRepository: ShopRepository;
  private initialized: boolean = false;

  constructor() {
    this.shopRepository = new ShopRepository();
  }

  /**
   * Initialize the shop service
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    this.initialized = true;
    return true;
  }

  /**
   * Get a shop by user ID
   */
  async getShopByUserId(userId: string): Promise<Shop | null> {
    return await this.shopRepository.getShopByUserId(userId);
  }

  /**
   * Get a shop by ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    return await this.shopRepository.getShopById(id);
  }

  /**
   * Get all shops
   */
  async getAllShops(): Promise<Shop[]> {
    return await this.shopRepository.getAllShops();
  }

  /**
   * Create a new shop
   */
  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop> {
    return await this.shopRepository.createShop(shop);
  }

  /**
   * Update a shop
   */
  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop> {
    return await this.shopRepository.updateShop(id, shop);
  }

  /**
   * Update shop status
   */
  async updateShopStatus(id: string, status: ShopStatus): Promise<boolean> {
    return await this.shopRepository.updateShopStatus(id, status);
  }

  /**
   * Get shop items
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return await this.shopRepository.getShopItems(shopId);
  }

  /**
   * Get shop item by ID
   */
  async getShopItemById(id: string): Promise<ShopItem | null> {
    return await this.shopRepository.getShopItemById(id);
  }

  /**
   * Create a new shop item
   */
  async createShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    return await this.shopRepository.createShopItem(item);
  }

  /**
   * Update a shop item
   */
  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem> {
    return await this.shopRepository.updateShopItem(id, item);
  }

  /**
   * Update shop item status
   */
  async updateShopItemStatus(id: string, status: ShopItem['status']): Promise<boolean> {
    return await this.shopRepository.updateShopItemStatus(id, status);
  }

  /**
   * Delete a shop item
   */
  async deleteShopItem(id: string): Promise<boolean> {
    return await this.shopRepository.deleteShopItem(id);
  }

  /**
   * Get shop reviews
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return await this.shopRepository.getShopReviews(shopId);
  }

  /**
   * Add a shop review
   */
  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
    return await this.shopRepository.addShopReview(review);
  }

  /**
   * Get shop orders
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    return await this.shopRepository.getShopOrders(shopId);
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    return await this.shopRepository.getOrderById(id);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    return await this.shopRepository.updateOrderStatus(id, status);
  }

  /**
   * Get shop settings
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return await this.shopRepository.getShopSettings(shopId);
  }

  /**
   * Create shop settings
   */
  async createShopSettings(settings: Omit<ShopSettings, 'id' | 'created_at' | 'updated_at'>): Promise<ShopSettings> {
    return await this.shopRepository.createShopSettings(settings);
  }

  /**
   * Update shop settings
   */
  async updateShopSettings(id: string, settings: Partial<ShopSettings>): Promise<boolean> {
    return await this.shopRepository.updateShopSettings(id, settings);
  }
}
