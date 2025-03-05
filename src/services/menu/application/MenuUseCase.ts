
import { MenuItem } from '../types';
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuCacheService } from './MenuCacheService';

export class MenuUseCase {
  private menuRepository: IMenuRepository;
  private cacheService: MenuCacheService;

  constructor(menuRepository: IMenuRepository, cacheService: MenuCacheService) {
    this.menuRepository = menuRepository;
    this.cacheService = cacheService;
  }

  /**
   * Get all menu items
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    // Try to get from cache first
    const cachedItems = this.cacheService.getCache('all_menu_items');
    if (cachedItems) {
      return cachedItems;
    }

    // If not in cache, get from repository
    const items = await this.menuRepository.getAllMenuItems();
    
    // Store in cache
    this.cacheService.setCache('all_menu_items', items);
    
    return items;
  }

  /**
   * Get menu items by category
   */
  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    // Try to get from cache first
    const cachedItems = this.cacheService.getCache(`category_${category}`);
    if (cachedItems) {
      return cachedItems;
    }

    // If not in cache, get from repository
    const items = await this.menuRepository.getMenuItemsByCategory(category);
    
    // Store in cache
    this.cacheService.setCache(`category_${category}`, items);
    
    return items;
  }

  /**
   * Get menu items by module
   */
  async getMenuItemsByModule(moduleCode: string): Promise<MenuItem[]> {
    // Try to get from cache first
    const cachedItems = this.cacheService.getCache(`module_${moduleCode}`);
    if (cachedItems) {
      return cachedItems;
    }

    // If not in cache, get from repository
    const items = await this.menuRepository.getMenuItemsByModule(moduleCode);
    
    // Store in cache
    this.cacheService.setCache(`module_${moduleCode}`, items);
    
    return items;
  }

  /**
   * Get menu items by parent
   */
  async getMenuItemsByParent(parentId: string): Promise<MenuItem[]> {
    // Try to get from cache first
    const cachedItems = this.cacheService.getCache(`parent_${parentId}`);
    if (cachedItems) {
      return cachedItems;
    }

    // If not in cache, get from repository
    const items = await this.menuRepository.getMenuItemsByParent(parentId);
    
    // Store in cache
    this.cacheService.setCache(`parent_${parentId}`, items);
    
    return items;
  }

  /**
   * Create a new menu item
   */
  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null> {
    const newItem = await this.menuRepository.createMenuItem(item);
    
    // Invalidate cache
    this.cacheService.invalidateCache();
    
    return newItem;
  }

  /**
   * Update a menu item
   */
  async updateMenuItem(item: Partial<MenuItem> & { id: string }): Promise<MenuItem | null> {
    const updatedItem = await this.menuRepository.updateMenuItem(item);
    
    // Invalidate cache
    this.cacheService.invalidateCache();
    
    return updatedItem;
  }

  /**
   * Delete a menu item
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    const success = await this.menuRepository.deleteMenuItem(id);
    
    // Invalidate cache
    this.cacheService.invalidateCache();
    
    return success;
  }
}
