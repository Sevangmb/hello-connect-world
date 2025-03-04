
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuCacheService } from './MenuCacheService';
import { MenuTreeBuilder } from './MenuTreeBuilder';
import { MenuItem } from '../types';
import { eventBus } from '@/core/event-bus/EventBus';

export class MenuUseCase {
  constructor(
    private menuRepository: IMenuRepository,
    private cacheService: MenuCacheService,
    private treeBuilder: MenuTreeBuilder
  ) {}

  /**
   * Récupère les éléments de menu par catégorie
   */
  async getMenuItemsByCategory(category: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    const cacheKey = `menu_category_${category}_${isAdmin ? 'admin' : 'user'}`;
    
    // Essayer de récupérer depuis le cache
    const cachedItems = this.cacheService.getCache<MenuItem[]>(cacheKey);
    if (cachedItems) {
      return cachedItems;
    }
    
    // Récupérer depuis le repository
    const items = await this.menuRepository.getMenuItemsByCategory(category, isAdmin);
    
    // Mettre en cache
    this.cacheService.setCache(cacheKey, items);
    
    return items;
  }

  /**
   * Récupère les éléments de menu par module
   */
  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    const cacheKey = `menu_module_${moduleCode}_${isAdmin ? 'admin' : 'user'}`;
    
    // Essayer de récupérer depuis le cache
    const cachedItems = this.cacheService.getCache<MenuItem[]>(cacheKey);
    if (cachedItems) {
      return cachedItems;
    }
    
    // Récupérer depuis le repository
    const items = await this.menuRepository.getMenuItemsByModule(moduleCode, isAdmin);
    
    // Mettre en cache
    this.cacheService.setCache(cacheKey, items);
    
    return items;
  }

  /**
   * Récupère tous les éléments de menu visibles
   */
  async getVisibleMenuItems(isAdmin: boolean = false): Promise<MenuItem[]> {
    const cacheKey = `menu_visible_${isAdmin ? 'admin' : 'user'}`;
    
    // Essayer de récupérer depuis le cache
    const cachedItems = this.cacheService.getCache<MenuItem[]>(cacheKey);
    if (cachedItems) {
      return cachedItems;
    }
    
    // Récupérer depuis le repository
    const items = await this.menuRepository.getVisibleMenuItems(isAdmin);
    
    // Mettre en cache
    this.cacheService.setCache(cacheKey, items);
    
    return items;
  }

  /**
   * Récupère tous les éléments de menu
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    const cacheKey = 'menu_all';
    
    // Essayer de récupérer depuis le cache
    const cachedItems = this.cacheService.getCache<MenuItem[]>(cacheKey);
    if (cachedItems) {
      return cachedItems;
    }
    
    // Récupérer depuis le repository
    const items = await this.menuRepository.getAllMenuItems();
    
    // Mettre en cache
    this.cacheService.setCache(cacheKey, items);
    
    return items;
  }

  /**
   * Crée un nouvel élément de menu
   */
  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const newItem = await this.menuRepository.createMenuItem(item);
    
    // Invalider le cache
    this.cacheService.invalidateCache();
    
    // Publier un événement
    eventBus.publish('menu:updated', { action: 'create', item: newItem });
    
    return newItem;
  }

  /**
   * Met à jour un élément de menu
   */
  async updateMenuItem(item: Partial<MenuItem> & { id: string }): Promise<MenuItem> {
    const updatedItem = await this.menuRepository.updateMenuItem(item.id, item);
    
    // Invalider le cache
    this.cacheService.invalidateCache();
    
    // Publier un événement
    eventBus.publish('menu:updated', { action: 'update', item: updatedItem });
    
    return updatedItem;
  }

  /**
   * Supprime un élément de menu
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    const success = await this.menuRepository.deleteMenuItem(id);
    
    // Invalider le cache
    this.cacheService.invalidateCache();
    
    // Publier un événement
    eventBus.publish('menu:updated', { action: 'delete', itemId: id });
    
    return success;
  }
}
