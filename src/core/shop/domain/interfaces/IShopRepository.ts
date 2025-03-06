
import { Shop, ShopItem, ShopSettings, ShopReview, Order, CartItem, DbCartItem } from '../types';

export interface IShopRepository {
  // Shop operations
  getShopById(id: string): Promise<Shop | null>;
  getUserShop(userId: string): Promise<Shop | null>;
  createShop(shop: Partial<Shop>): Promise<Shop | null>;
  updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null>;
  
  // Shop items operations
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(item: Partial<ShopItem>): Promise<ShopItem | null>;
  updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null>;
  
  // Shop settings operations
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null>;
  
  // Shop reviews operations
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  createShopReview(review: Partial<ShopReview>): Promise<ShopReview | null>;
  
  // Orders operations
  getOrdersByShopId(shopId: string): Promise<Order[]>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  
  // Optional additional methods that might be implemented
  getOrderById?(id: string): Promise<Order | null>;
  createOrder?(order: Partial<Order>): Promise<Order | null>;
  updateOrderStatus?(id: string, status: string): Promise<boolean>;
  
  // Cart operations
  getCartItems?(userId: string): Promise<CartItem[]>;
  addToCart?(item: DbCartItem): Promise<CartItem | null>;
  updateCartItemQuantity?(id: string, quantity: number): Promise<boolean>;
  removeFromCart?(id: string): Promise<boolean>;
  clearCart?(userId: string): Promise<boolean>;
  
  // Favorites operations
  getUserFavoriteShops?(userId: string): Promise<Shop[]>;
  isShopFavorited?(userId: string, shopId: string): Promise<boolean>;
  toggleShopFavorite?(userId: string, shopId: string): Promise<boolean>;
}
