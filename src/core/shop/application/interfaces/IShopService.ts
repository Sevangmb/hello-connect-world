
import { 
  Shop, 
  ShopItem, 
  ShopSettings, 
  ShopReview, 
  Order, 
  OrderStatus, 
  PaymentStatus 
} from '../../domain/types';

/**
 * Interface pour le service de boutique
 * Définit les contrats pour toutes les opérations liées aux boutiques
 */
export interface IShopService {
  // ===== Méthodes liées aux boutiques =====
  
  /**
   * Récupère une boutique par son ID
   */
  getShopById(shopId: string): Promise<Shop | null>;
  
  /**
   * Récupère une boutique par l'ID de l'utilisateur
   */
  getShopByUserId(userId: string): Promise<Shop | null>;
  
  /**
   * Met à jour une boutique
   */
  updateShop(shopId: string, shopData: Partial<Shop>): Promise<Shop | null>;
  
  /**
   * Crée une boutique
   */
  createShop(shop: Partial<Shop>): Promise<Shop | null>;
  
  // ===== Méthodes liées aux paramètres =====
  
  /**
   * Récupère les paramètres d'une boutique
   */
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  
  /**
   * Crée ou met à jour les paramètres d'une boutique
   */
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null>;
  
  // ===== Méthodes liées aux articles =====
  
  /**
   * Récupère les articles d'une boutique
   */
  getShopItems(shopId: string): Promise<ShopItem[]>;
  
  /**
   * Récupère un article par son ID
   */
  getShopItemById(itemId: string): Promise<ShopItem | null>;
  
  /**
   * Crée un nouvel article de boutique
   */
  createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem | null>;
  
  /**
   * Met à jour un article de boutique
   */
  updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem | null>;
  
  /**
   * Supprime un article de boutique
   */
  deleteShopItem(itemId: string): Promise<boolean>;
  
  // ===== Méthodes liées aux avis =====
  
  /**
   * Récupère les avis d'une boutique
   */
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  
  /**
   * Ajoute un avis pour une boutique
   */
  addShopReview(review: { shop_id: string; user_id: string; rating: number; comment?: string }): Promise<ShopReview | null>;
  
  /**
   * Met à jour un avis
   */
  updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview | null>;
  
  /**
   * Supprime un avis
   */
  deleteShopReview(reviewId: string): Promise<boolean>;
  
  // ===== Méthodes liées aux commandes =====
  
  /**
   * Récupère les commandes d'une boutique
   */
  getShopOrders(shopId: string): Promise<Order[]>;
  
  /**
   * Récupère les commandes d'un client
   */
  getCustomerOrders(customerId: string): Promise<Order[]>;
  
  /**
   * Récupère une commande par son ID
   */
  getOrderById(orderId: string): Promise<Order | null>;
  
  /**
   * Crée une commande
   */
  createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null>;
  
  /**
   * Met à jour le statut d'une commande
   */
  updateOrderStatus(orderId: string, status: string): Promise<boolean>;
  
  /**
   * Met à jour le statut de paiement d'une commande
   */
  updatePaymentStatus(orderId: string, status: string): Promise<boolean>;
}
