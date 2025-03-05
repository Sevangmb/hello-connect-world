
/**
 * Interface de repository pour le service catalogue
 */
import { CatalogFilter, CatalogItem, CatalogResult, PriceUpdate, StockUpdate } from '../types';

export interface ICatalogRepository {
  /**
   * Récupère un élément du catalogue par ID
   */
  getItemById(itemId: string): Promise<CatalogItem | null>;
  
  /**
   * Recherche des éléments du catalogue selon les filtres
   */
  searchItems(filter: CatalogFilter): Promise<CatalogResult>;
  
  /**
   * Mettre à jour le statut d'un article
   */
  updateItemStatus(update: StockUpdate): Promise<boolean>;
  
  /**
   * Mettre à jour le prix d'un article
   */
  updateItemPrice(update: PriceUpdate): Promise<boolean>;
  
  /**
   * Récupère les articles d'un vendeur
   */
  getSellerItems(sellerId: string, filter?: CatalogFilter): Promise<CatalogResult>;
  
  /**
   * Récupère les articles d'une boutique
   */
  getShopItems(shopId: string, filter?: CatalogFilter): Promise<CatalogResult>;
  
  /**
   * Récupère les articles par catégorie
   */
  getItemsByCategory(category: string, filter?: CatalogFilter): Promise<CatalogResult>;
}
