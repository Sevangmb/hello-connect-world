
import { ShopRepository } from "../infrastructure/ShopRepository";
import { Shop, ShopItem, ShopStatus, Order, ShopReview, ShopSettings } from "../domain/types";

/**
 * Service pour la gestion des boutiques
 * Couche Application de la Clean Architecture
 */
export class ShopService {
  private repository: ShopRepository;

  constructor(repository: ShopRepository) {
    this.repository = repository;
  }

  /**
   * Récupère une boutique par l'ID de l'utilisateur
   */
  async getUserShop(userId: string): Promise<Shop | null> {
    return this.repository.getShopByUserId(userId);
  }

  /**
   * Récupère une boutique par son ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    return this.repository.getShopById(id);
  }

  /**
   * Récupère toutes les boutiques
   */
  async getAllShops(): Promise<Shop[]> {
    return this.repository.getAllShops();
  }

  /**
   * Crée une nouvelle boutique
   */
  async createShop(shopData: Omit<Shop, "id" | "created_at" | "updated_at">): Promise<Shop> {
    return this.repository.createShop(shopData);
  }

  /**
   * Met à jour une boutique
   */
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    return this.repository.updateShop(id, shopData);
  }

  /**
   * Met à jour le statut d'une boutique
   */
  async updateShopStatus(id: string, status: ShopStatus): Promise<boolean> {
    return this.repository.updateShopStatus(id, status);
  }

  /**
   * Récupère tous les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.repository.getShopItems(shopId);
  }

  /**
   * Récupère un article par son ID
   */
  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.repository.getShopItemById(id);
  }

  /**
   * Crée un nouvel article dans une boutique
   */
  async createShopItem(itemData: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem> {
    return this.repository.createShopItem(itemData);
  }

  /**
   * Met à jour un article
   */
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return this.repository.updateShopItem(id, itemData);
  }

  /**
   * Supprime un article
   */
  async deleteShopItem(id: string): Promise<boolean> {
    return this.repository.deleteShopItem(id);
  }

  /**
   * Met à jour le statut d'un article
   */
  async updateShopItemStatus(id: string, status: string): Promise<boolean> {
    return this.repository.updateShopItemStatus(id, status);
  }

  /**
   * Récupère les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.repository.getShopReviews(shopId);
  }

  /**
   * Ajoute un avis sur une boutique
   */
  async addShopReview(review: Omit<ShopReview, "id" | "created_at" | "updated_at">): Promise<ShopReview> {
    return this.repository.addShopReview(review);
  }

  /**
   * Récupère les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.repository.getShopOrders(shopId);
  }

  /**
   * Récupère une commande par son ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    return this.repository.getOrderById(id);
  }

  /**
   * Met à jour le statut d'une commande
   */
  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    return this.repository.updateOrderStatus(id, status);
  }

  /**
   * Récupère les paramètres d'une boutique
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.repository.getShopSettings(shopId);
  }

  /**
   * Met à jour les paramètres d'une boutique
   */
  async updateShopSettings(id: string, settings: Partial<ShopSettings>): Promise<boolean> {
    return this.repository.updateShopSettings(id, settings);
  }
}
