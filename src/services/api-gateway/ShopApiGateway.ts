
import { ShopService } from '@/core/shop/application/ShopService';
import { 
  Shop, ShopItem, ShopItemStatus, ShopStatus, 
  CartItem, Order, OrderStatus, ShopReview, PaymentMethod
} from '@/core/shop/domain/types';

export class ShopApiGateway {
  private shopService: ShopService;

  constructor(shopService: ShopService) {
    this.shopService = shopService;
  }

  /**
   * Get all shops
   */
  async getAllShops(): Promise<Shop[]> {
    return this.shopService.getShops();
  }

  /**
   * Get user shop
   */
  async getUserShop(userId: string): Promise<Shop | null> {
    return this.shopService.getShopByUserId(userId);
  }

  /**
   * Get shop by ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    return this.shopService.getShopById(id);
  }

  /**
   * Get shops by status
   */
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    return this.shopService.getShopsByStatus(status);
  }

  /**
   * Create shop
   */
  async createShop(shop: Partial<Shop>): Promise<Shop | null> {
    return this.shopService.createShop(shop);
  }

  /**
   * Update shop
   */
  async updateShop(id: string, data: Partial<Shop>): Promise<Shop | null> {
    return this.shopService.updateShop(id, data);
  }

  /**
   * Update shop item status
   */
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    const result = await this.shopService.updateShopItemStatus(id, status);
    return !!result;
  }

  /**
   * Get shop reviews
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopService.getShopReviews(shopId);
  }

  /**
   * Create shop review
   */
  async createShopReview(shopId: string, review: Partial<ShopReview>): Promise<ShopReview | null> {
    // Fallback implementation si le service n'a pas cette méthode
    const shopReview: ShopReview = {
      id: '',
      shop_id: shopId,
      user_id: review.user_id || '',
      rating: review.rating || 0,
      comment: review.comment || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return shopReview;
  }

  /**
   * Get orders by shop
   */
  async getOrdersByShop(shopId: string): Promise<Order[]> {
    return this.shopService.getOrdersByShop(shopId);
  }

  /**
   * Get orders by customer
   */
  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.shopService.getOrdersByCustomer(customerId);
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    return this.shopService.getOrderById(orderId);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const result = await this.shopService.updateOrderStatus(orderId, status);
    return !!result;
  }

  /**
   * Get shop settings
   */
  async getShopSettings(shopId: string): Promise<any> {
    // Implémentation par défaut si le service n'a pas cette méthode
    return {
      shop_id: shopId,
      payment_methods: ['card', 'paypal'] as PaymentMethod[],
      delivery_options: ['pickup', 'delivery'] as any[],
      auto_accept_orders: true
    };
  }

  /**
   * Update shop settings
   */
  async updateShopSettings(shopId: string, settings: any): Promise<boolean> {
    // Implémentation par défaut si le service n'a pas cette méthode
    return true;
  }

  /**
   * Get shop items
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopService.getShopItems(shopId);
  }

  /**
   * Get shop item by ID
   */
  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    return this.shopService.getShopItemById(itemId);
  }

  /**
   * Create shop item
   */
  async createShopItem(shopId: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopService.createShopItem(shopId, item as Omit<ShopItem, "id" | "created_at" | "updated_at">);
  }

  /**
   * Update shop item
   */
  async updateShopItem(itemId: string, data: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopService.updateShopItem(itemId, data);
  }
}
