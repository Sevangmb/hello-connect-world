
import { MenuItem, MenuItemCategory } from "../types";
import { IMenuRepository } from "../domain/interfaces/IMenuRepository";
import { MenuCacheService } from "./MenuCacheService";
import { MenuTreeBuilder } from "./MenuTreeBuilder";

/**
 * Cas d'utilisation pour la gestion des menus
 * Couche Application de la Clean Architecture
 */
export class MenuUseCase {
  private repository: IMenuRepository;
  private cacheService: MenuCacheService;
  private treeBuilder: MenuTreeBuilder;
  
  constructor(repository: IMenuRepository) {
    this.repository = repository;
    this.cacheService = new MenuCacheService();
    this.treeBuilder = new MenuTreeBuilder();
  }
  
  /**
   * Récupère tous les éléments de menu avec gestion du cache
   * @param useCache Indique si le cache doit être utilisé
   */
  async getAllMenuItems(useCache = true): Promise<MenuItem[]> {
    // Vérifier si le cache est valide
    if (useCache && this.cacheService.isCacheValid()) {
      return this.cacheService.getCachedItems();
    }
    
    try {
      const items = await this.repository.getAllMenuItems();
      
      // Mettre à jour le cache
      this.cacheService.updateCache(items);
      
      return items;
    } catch (error) {
      // En cas d'erreur, utiliser le cache même s'il est expiré
      if (this.cacheService.getCachedItems().length > 0) {
        console.warn("Utilisation du cache expiré pour les éléments de menu en raison d'une erreur");
        return this.cacheService.getCachedItems();
      }
      throw error;
    }
  }
  
  /**
   * Récupère les éléments de menu visibles pour un utilisateur
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  async getVisibleMenuItems(isAdmin: boolean): Promise<MenuItem[]> {
    return this.repository.getVisibleMenuItems(isAdmin);
  }
  
  /**
   * Récupère les éléments de menu par catégorie
   * @param category Catégorie des éléments de menu
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  async getMenuItemsByCategory(category: MenuItemCategory, isAdmin: boolean): Promise<MenuItem[]> {
    return this.repository.getMenuItemsByCategory(category, isAdmin);
  }
  
  /**
   * Récupère les éléments de menu par module
   * @param moduleCode Code du module
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean): Promise<MenuItem[]> {
    return this.repository.getMenuItemsByModule(moduleCode, isAdmin);
  }
  
  /**
   * Organise les éléments de menu sous forme d'arborescence
   * @param menuItems Liste plate des éléments de menu
   */
  buildMenuTree(menuItems: MenuItem[]): MenuItem[] {
    return this.treeBuilder.buildMenuTree(menuItems);
  }
  
  /**
   * Met à jour un élément de menu
   * @param menuItem Élément de menu à mettre à jour
   */
  async updateMenuItem(menuItem: Partial<MenuItem> & { id: string }): Promise<MenuItem> {
    const updatedItem = await this.repository.updateMenuItem(menuItem);
    
    // Invalider le cache
    this.cacheService.invalidateCache();
    
    return updatedItem;
  }
  
  /**
   * Crée un nouvel élément de menu
   * @param menuItem Élément de menu à créer
   */
  async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const newItem = await this.repository.createMenuItem(menuItem);
    
    // Invalider le cache
    this.cacheService.invalidateCache();
    
    return newItem;
  }
  
  /**
   * Supprime un élément de menu
   * @param id Identifiant de l'élément de menu
   */
  async deleteMenuItem(id: string): Promise<void> {
    await this.repository.deleteMenuItem(id);
    
    // Invalider le cache
    this.cacheService.invalidateCache();
  }
  
  /**
   * Met à jour les positions des éléments de menu
   * @param updates Tableau de mises à jour avec ID et nouvelle position
   */
  async updateMenuPositions(updates: { id: string; position: number }[]): Promise<void> {
    await this.repository.updateMenuPositions(updates);
    
    // Invalider le cache
    this.cacheService.invalidateCache();
  }
}
