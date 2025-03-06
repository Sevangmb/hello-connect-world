
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopSettings, ShopReview, Order, CartItem, DbCartItem } from '../domain/types';

export class ShopService {
  private shopRepository: IShopRepository;

  constructor(shopRepository: IShopRepository) {
    this.shopRepository = shopRepository;
  }

  async getUserShop(userId: string): Promise<Shop | null> {
    return this.shopRepository.getUserShop(userId);
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
    return this.shopRepository.getShopItems(shopId);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopRepository.getShopItemById(id);
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopRepository.createShopItem(item);
  }

  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopRepository.updateShopItem(id, item);
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }

  async createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return this.shopRepository.createShopSettings(settings);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return this.shopRepository.updateShopSettings(shopId, settings);
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviews(shopId);
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview | null> {
    return this.shopRepository.createShopReview(review);
  }

  async getOrdersByShopId(shopId: string): Promise<Order[]> {
    return this.shopRepository.getOrdersByShopId(shopId);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.shopRepository.getOrdersByUserId(userId);
  }

  // Optional methods - implement with null checks to avoid runtime errors
  async getOrderById(id: string): Promise<Order | null> {
    return this.shopRepository.getOrderById ? this.shopRepository.getOrderById(id) : null;
  }

  async createOrder(order: Partial<Order>): Promise<Order | null> {
    return this.shopRepository.createOrder ? this.shopRepository.createOrder(order) : null;
  }

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    return this.shopRepository.updateOrderStatus ? this.shopRepository.updateOrderStatus(id, status) : false;
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return this.shopRepository.getCartItems ? this.shopRepository.getCartItems(userId) : [];
  }

  async addToCart(item: DbCartItem): Promise<CartItem | null> {
    return this.shopRepository.addToCart ? this.shopRepository.addToCart(item) : null;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<boolean> {
    return this.shopRepository.updateCartItemQuantity 
      ? this.shopRepository.updateCartItemQuantity(id, quantity) 
      : false;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.shopRepository.removeFromCart ? this.shopRepository.removeFromCart(id) : false;
  }

  async clearCart(userId: string): Promise<boolean> {
    return this.shopRepository.clearCart ? this.shopRepository.clearCart(userId) : false;
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    return this.shopRepository.getUserFavoriteShops ? this.shopRepository.getUserFavoriteShops(userId) : [];
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.isShopFavorited 
      ? this.shopRepository.isShopFavorited(userId, shopId) 
      : false;
  }

  async toggleShopFavorite(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.toggleShopFavorite 
      ? this.shopRepository.toggleShopFavorite(userId, shopId) 
      : false;
  }
}
