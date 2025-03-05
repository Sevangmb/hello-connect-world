
/**
 * Service de catalogue - Couche application
 */
import { ICatalogRepository } from '../domain/interfaces/ICatalogRepository';
import { 
  CatalogFilter, 
  CatalogItem, 
  CatalogResult, 
  PriceUpdate, 
  StockUpdate 
} from '../domain/types';

export class CatalogService {
  private catalogRepository: ICatalogRepository;
  private cache: Map<string, { item: CatalogItem, timestamp: number }> = new Map();
  private searchCache: Map<string, { result: CatalogResult, timestamp: number }> = new Map();
  private readonly ITEM_CACHE_TTL = 60000; // 1 minute pour les articles individuels
  private readonly SEARCH_CACHE_TTL = 30000; // 30 secondes pour les résultats de recherche
  
  constructor(catalogRepository: ICatalogRepository) {
    this.catalogRepository = catalogRepository;
  }
  
  /**
   * Génère une clé de cache pour les filtres de recherche
   */
  private getSearchCacheKey(filter: CatalogFilter): string {
    return JSON.stringify(filter);
  }
  
  /**
   * Récupère un élément du catalogue par ID avec gestion de cache
   */
  async getItemById(itemId: string): Promise<CatalogItem | null> {
    // Vérifier le cache
    const cached = this.cache.get(itemId);
    if (cached && Date.now() - cached.timestamp < this.ITEM_CACHE_TTL) {
      return cached.item;
    }
    
    // Récupérer depuis le repository
    const item = await this.catalogRepository.getItemById(itemId);
    
    if (item) {
      // Mettre en cache
      this.cache.set(itemId, { item, timestamp: Date.now() });
    }
    
    return item;
  }
  
  /**
   * Recherche des éléments du catalogue selon les filtres avec gestion de cache
   */
  async searchItems(filter: CatalogFilter): Promise<CatalogResult> {
    const cacheKey = this.getSearchCacheKey(filter);
    
    // Vérifier le cache pour les recherches, sauf si un offset est spécifié
    // (puisque les utilisateurs peuvent naviguer dans les pages)
    if (!filter.offset) {
      const cached = this.searchCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.SEARCH_CACHE_TTL) {
        return cached.result;
      }
    }
    
    // Récupérer depuis le repository
    const result = await this.catalogRepository.searchItems(filter);
    
    // Mettre en cache seulement la première page des résultats
    if (!filter.offset) {
      this.searchCache.set(cacheKey, { result, timestamp: Date.now() });
    }
    
    return result;
  }
  
  /**
   * Mettre à jour le statut d'un article
   */
  async updateItemStatus(update: StockUpdate): Promise<boolean> {
    const success = await this.catalogRepository.updateItemStatus(update);
    
    if (success) {
      // Invalider le cache
      this.cache.delete(update.itemId);
      this.searchCache.clear(); // Invalider toutes les recherches cachées
    }
    
    return success;
  }
  
  /**
   * Mettre à jour le prix d'un article
   */
  async updateItemPrice(update: PriceUpdate): Promise<boolean> {
    const success = await this.catalogRepository.updateItemPrice(update);
    
    if (success) {
      // Invalider le cache
      this.cache.delete(update.itemId);
      this.searchCache.clear(); // Invalider toutes les recherches cachées
    }
    
    return success;
  }
  
  /**
   * Récupère les articles d'un vendeur
   */
  async getSellerItems(sellerId: string, filter: CatalogFilter = {}): Promise<CatalogResult> {
    return this.catalogRepository.getSellerItems(sellerId, filter);
  }
  
  /**
   * Récupère les articles d'une boutique
   */
  async getShopItems(shopId: string, filter: CatalogFilter = {}): Promise<CatalogResult> {
    return this.catalogRepository.getShopItems(shopId, filter);
  }
  
  /**
   * Récupère les articles par catégorie
   */
  async getItemsByCategory(category: string, filter: CatalogFilter = {}): Promise<CatalogResult> {
    return this.catalogRepository.getItemsByCategory(category, filter);
  }
  
  /**
   * Invalide le cache pour un élément
   */
  invalidateItemCache(itemId: string): void {
    this.cache.delete(itemId);
  }
  
  /**
   * Invalide le cache des recherches
   */
  invalidateSearchCache(): void {
    this.searchCache.clear();
  }
  
  /**
   * Efface tous les caches
   */
  clearAllCaches(): void {
    this.cache.clear();
    this.searchCache.clear();
  }
}
