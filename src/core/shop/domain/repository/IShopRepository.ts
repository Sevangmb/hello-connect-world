
import { Shop, ShopItem, ShopItemStatus, CartItem, Order, OrderStatus, ShopReview, ShopSettings } from '../types';

export interface IShopRepository {
  // Opérations pour les boutiques
  getShopById(id: string): Promise<Shop | null>;
  getUserShops(userId: string): Promise<Shop[]>;
  getShopsByStatus(status: string): Promise<Shop[]>;
  createShop(shop: Partial<Shop>): Promise<Shop>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop>;
  deleteShop(id: string): Promise<boolean>;
  
  // Opérations pour les articles de boutique
  getShopItemById(id: string): Promise<ShopItem | null>;
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getAllShopItems(limit?: number): Promise<ShopItem[]>;
  createShopItem(item: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean>;
  deleteShopItem(id: string): Promise<boolean>;
  addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]>;
  
  // Opérations pour le panier
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(userId: string, shopItemId: string, quantity?: number): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<boolean>;
  getCartTotal(userId: string): Promise<number>;
  
  // Opérations pour les commandes
  createOrder(order: Partial<Order>): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  getUserOrders(userId: string): Promise<Order[]>;
  getShopOrders(shopId: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  
  // Opérations pour les avis
  createShopReview(review: Partial<ShopReview>): Promise<ShopReview>;
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  deleteReview(id: string): Promise<boolean>;
  
  // Méthodes supplémentaires
  getShopByUserId(userId: string): Promise<Shop | null>;
  getShopItemsByShopId(shopId: string): Promise<ShopItem[]>;
  getShopReviewsByShopId(shopId: string): Promise<ShopReview[]>;
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings | null>;
  getFavoriteShops(userId: string): Promise<Shop[]>;
  isShopFavorited(userId: string, shopId: string): Promise<boolean>;
  addShopToFavorites(userId: string, shopId: string): Promise<boolean>;
  removeShopFromFavorites(userId: string, shopId: string): Promise<boolean>;
}
