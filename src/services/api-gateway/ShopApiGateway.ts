
import { shopService, getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, ShopStatus, ShopItemStatus, ShopReview, Order, OrderStatus } from '@/core/shop/domain/types';

/**
 * Passerelle API pour les services de boutique
 * Elle sert de façade pour les services sous-jacents
 */
export class ShopApiGateway {
  private shopService = shopService;

  // Obtenir une boutique par son ID
  async getShopById(id: string): Promise<Shop | null> {
    return this.shopService.getShopById(id);
  }

  // Obtenir la boutique d'un utilisateur
  async getUserShop(userId: string): Promise<Shop | null> {
    return this.shopService.getShopByUserId(userId);
  }

  // Obtenir toutes les boutiques
  async getShops(): Promise<Shop[]> {
    return this.shopService.getAllShops();
  }

  // Créer une nouvelle boutique
  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
    return this.shopService.createShop(shop);
  }

  // Mettre à jour une boutique
  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null> {
    return this.shopService.updateShop(id, shop);
  }

  // Obtenir les boutiques par statut
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    return this.shopService.getShopsByStatus(status);
  }

  // Obtenir les articles d'une boutique
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopService.getShopItems(shopId);
  }

  // Obtenir un article par son ID
  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopService.getShopItemById(id);
  }

  // Mettre à jour le statut d'un article
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    return this.shopService.updateShopItemStatus(id, status);
  }

  // Obtenir les avis d'une boutique
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopService.getShopReviews(shopId);
  }

  // Vérifier si un utilisateur a mis une boutique en favori
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    return this.shopService.isShopFavorited(userId, shopId);
  }

  // Ajouter une boutique aux favoris
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopService.addShopToFavorites(userId, shopId);
  }

  // Supprimer une boutique des favoris
  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopService.removeShopFromFavorites(userId, shopId);
  }

  // Obtenir les boutiques favorites d'un utilisateur
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return this.shopService.getFavoriteShops(userId);
  }
  
  // Pour les fonctionnalités non encore implémentées, on retourne des valeurs par défaut
  async createShopItem(shopId: string, item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    const items = [item];
    const result = await this.shopService.addShopItems(shopId, items);
    // TODO: Améliorer cette implémentation pour récupérer l'item créé
    if (result) {
      // On retourne un item factice pour le moment
      return {
        id: 'temp-id',
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return null;
  }
}

// Exporter une instance de la passerelle
export const shopApiGateway = new ShopApiGateway();
