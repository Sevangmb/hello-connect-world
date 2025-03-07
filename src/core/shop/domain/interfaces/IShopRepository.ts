
import { Shop, ShopSettings } from '../types';

export interface IShopRepository {
  /**
   * Récupère une boutique par son ID
   */
  getShopById(shopId: string): Promise<Shop | null>;
  
  /**
   * Récupère une boutique par l'ID de l'utilisateur
   */
  getShopByUserId(userId: string): Promise<Shop | null>;
  
  /**
   * Récupère les paramètres d'une boutique
   */
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  
  /**
   * Crée ou met à jour les paramètres d'une boutique
   */
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null>;
  
  /**
   * Met à jour une boutique
   */
  updateShop(shopId: string, shopData: Partial<Shop>): Promise<Shop | null>;
}
