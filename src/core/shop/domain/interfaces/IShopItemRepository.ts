
import { ShopItem } from '../types';

export interface IShopItemRepository {
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
  createShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null>;
  
  /**
   * Met à jour un article de boutique
   */
  updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem | null>;
  
  /**
   * Supprime un article de boutique
   */
  deleteShopItem(itemId: string): Promise<boolean>;
}
