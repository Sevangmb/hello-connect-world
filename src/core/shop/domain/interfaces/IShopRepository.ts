
import { Shop, ShopItem, ShopSettings, Order, ShopReview } from "../../domain/types";

/**
 * Interface du repository pour le module de boutique
 * Définit les opérations de persistance pour les boutiques
 */
export interface IShopRepository {
  // Boutiques
  getAllShops(): Promise<Shop[]>;
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  createShop(shop: Omit<Shop, "id" | "created_at" | "updated_at">): Promise<Shop>;
  updateShop(id: string, shop: Partial<Shop>): Promise<Shop>;
  updateShopStatus(id: string, status: string): Promise<boolean>;
  deleteShop(id: string): Promise<boolean>;
  
  // Articles de boutique
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem>;
  updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItemStatus(id: string, status: string): Promise<boolean>;
  deleteShopItem(id: string): Promise<boolean>;
  
  // Commandes
  getShopOrders(shopId: string): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<boolean>;
  
  // Avis sur les boutiques
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  addShopReview(review: Omit<ShopReview, "id" | "created_at" | "updated_at">): Promise<ShopReview>;
  
  // Paramètres de boutique
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  createShopSettings(settings: Omit<ShopSettings, "id" | "created_at" | "updated_at">): Promise<ShopSettings>;
  updateShopSettings(id: string, settings: Partial<ShopSettings>): Promise<boolean>;
}
