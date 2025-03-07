
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { IShopItemRepository } from '../domain/interfaces/IShopItemRepository';
import { IShopReviewRepository } from '../domain/interfaces/IShopReviewRepository';
import { IOrderRepository } from '../domain/interfaces/IOrderRepository';
import { Shop, ShopItem, ShopSettings, ShopReview, Order, CartItem, DbCartItem } from '../domain/types';

export class ShopService {
  private shopRepository: IShopRepository;
  private shopItemRepository: IShopItemRepository;
  private shopReviewRepository: IShopReviewRepository;
  private orderRepository: IOrderRepository;

  constructor(
    shopRepository: IShopRepository,
    shopItemRepository: IShopItemRepository,
    shopReviewRepository: IShopReviewRepository,
    orderRepository: IOrderRepository
  ) {
    this.shopRepository = shopRepository;
    this.shopItemRepository = shopItemRepository;
    this.shopReviewRepository = shopReviewRepository;
    this.orderRepository = orderRepository;
  }

  async getUserShop(userId: string): Promise<Shop | null> {
    const shops = await this.shopRepository.getUserShops(userId);
    return shops.length > 0 ? shops[0] : null;
  }

  async getShopById(shopId: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(shopId);
  }

  async createShop(shop: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.createShop(shop);
  }

  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.updateShop(id, shop);
  }

  async getShopItems(shopId?: string): Promise<ShopItem[]> {
    if (!shopId) return [];
    return this.shopItemRepository.getShopItems(shopId);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopItemRepository.getShopItemById(id);
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem | null> {
    // Ensure required fields have default values
    const itemToCreate = {
      shop_id: item.shop_id || '',
      name: item.name || 'New Item',
      price: item.price || 0,
      stock: item.stock || 0,
      status: item.status || 'available',
    } as Omit<ShopItem, "id" | "created_at" | "updated_at">;
    
    return this.shopItemRepository.createShopItem(itemToCreate);
  }

  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopItemRepository.updateShopItem(id, item);
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }

  async createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return this.shopRepository.updateShopSettings(settings.shop_id || '', settings);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return this.shopRepository.updateShopSettings(shopId, settings);
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopReviewRepository.getShopReviews(shopId);
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview | null> {
    if (!review.shop_id || !review.user_id || review.rating === undefined) {
      return null;
    }
    
    return this.shopReviewRepository.addShopReview({
      shop_id: review.shop_id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment
    });
  }

  async getOrdersByShopId(shopId: string): Promise<Order[]> {
    return this.orderRepository.getShopOrders(shopId);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.getCustomerOrders(userId);
  }

  // These methods now use optional chaining to safely call repository methods if they exist
  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.getOrderById(id);
  }

  async createOrder(order: Partial<Order>): Promise<Order | null> {
    if (!order.shop_id || !order.customer_id) {
      return null;
    }
    
    // Ensure required fields have default values
    const orderToCreate = {
      shop_id: order.shop_id,
      customer_id: order.customer_id,
      status: order.status || 'pending',
      total_amount: order.total_amount || 0,
      delivery_fee: order.delivery_fee || 0,
      payment_status: order.payment_status || 'pending',
      payment_method: order.payment_method || 'card',
      delivery_address: order.delivery_address || {
        street: '',
        city: '',
        postal_code: '',
        country: ''
      },
      items: order.items || [],
      seller_id: order.seller_id || order.shop_id,
      buyer_id: order.buyer_id || order.customer_id
    } as Omit<Order, "id" | "created_at" | "updated_at">;
    
    return this.orderRepository.createOrder(orderToCreate);
  }

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    return this.orderRepository.updateOrderStatus(id, status);
  }

  // Placeholder methods for cart functionality to be implemented
  async getCartItems(userId: string): Promise<CartItem[]> {
    console.log("Getting cart items for user", userId);
    return [];
  }

  async addToCart(item: DbCartItem): Promise<CartItem | null> {
    console.log("Adding item to cart", item);
    return null;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<boolean> {
    console.log("Updating cart item quantity", id, quantity);
    return false;
  }

  async removeFromCart(id: string): Promise<boolean> {
    console.log("Removing item from cart", id);
    return false;
  }

  async clearCart(userId: string): Promise<boolean> {
    console.log("Clearing cart for user", userId);
    return false;
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    console.log("Getting favorite shops for user", userId);
    return [];
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    console.log("Checking if shop is favorited", userId, shopId);
    return false;
  }

  async toggleShopFavorite(userId: string, shopId: string): Promise<boolean> {
    console.log("Toggling shop favorite", userId, shopId);
    return false;
  }
}
