
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { IMenuRepository } from '../../domain/interfaces/IMenuRepository';
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from '../../types';
import { BaseRepository } from '../base/BaseRepository';
import { MenuQueryBuilder } from '../utils/MenuQueryBuilder';

/**
 * Supabase implementation of the menu repository
 */
export class MenuRepositoryImpl extends BaseRepository<MenuItem> implements IMenuRepository {
  private static readonly ALL_ITEMS_KEY = 'all';
  private static readonly CATEGORY_PREFIX = 'category_';
  private static readonly MODULE_PREFIX = 'module_';
  private static readonly PARENT_PREFIX = 'parent_';

  /**
   * Get all menu items
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      if (this.isCacheValid(MenuRepositoryImpl.ALL_ITEMS_KEY)) {
        console.log('Repository: Using cached menu items');
        return this._cachedItems[MenuRepositoryImpl.ALL_ITEMS_KEY];
      }
      
      console.log('Repository: Fetching all menu items');
      const { data, error } = await MenuQueryBuilder.getAllItems();
      
      if (error) {
        console.error('Repository error:', error);
        throw error;
      }
      
      const items = data as MenuItem[] || [];
      this.updateCache(MenuRepositoryImpl.ALL_ITEMS_KEY, items);
      
      console.log(`Repository: Retrieved ${items.length} menu items`);
      return items;
    } catch (error) {
      console.error('Erreur lors de la récupération des éléments de menu:', error);
      throw error;
    }
  }

  /**
   * Get menu items by category
   */
  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    try {
      const cacheKey = `${MenuRepositoryImpl.CATEGORY_PREFIX}${category}`;
      
      if (this.isCacheValid(cacheKey)) {
        console.log(`Repository: Using cached menu items for category: ${category}`);
        return this._cachedItems[cacheKey];
      }
      
      console.log(`Repository: Fetching menu items for category: ${category}`);
      
      if (this.isCacheValid(MenuRepositoryImpl.ALL_ITEMS_KEY)) {
        const filteredItems = this._cachedItems[MenuRepositoryImpl.ALL_ITEMS_KEY]
          .filter(item => item.category === category);
        
        this.updateCache(cacheKey, filteredItems);
        console.log(`Repository: Filtered ${filteredItems.length} items for category ${category} from cache`);
        return filteredItems;
      }
      
      const { data, error } = await MenuQueryBuilder.getItemsByCategory(category);
      
      if (error) {
        console.error(`Repository error for category ${category}:`, error);
        throw error;
      }
      
      const items = data as MenuItem[] || [];
      this.updateCache(cacheKey, items);
      
      console.log(`Repository: Retrieved ${items.length} menu items for category ${category}`);
      return items;
    } catch (error) {
      console.error(`Erreur lors de la récupération des éléments de menu pour la catégorie ${category}:`, error);
      throw error;
    }
  }

  /**
   * Get menu items by module
   */
  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    try {
      const cacheKey = `${MenuRepositoryImpl.MODULE_PREFIX}${moduleCode}_${isAdmin ? 'admin' : 'user'}`;
      
      if (this.isCacheValid(cacheKey)) {
        console.log(`Repository: Using cached menu items for module: ${moduleCode}`);
        return this._cachedItems[cacheKey];
      }
      
      console.log(`Repository: Fetching items for module ${moduleCode}, isAdmin: ${isAdmin}`);
      const isModuleActive = await moduleApiGateway.isModuleActive(moduleCode);
      
      if (!isModuleActive && !isAdmin && moduleCode !== 'admin' && !moduleCode.startsWith('admin_')) {
        console.log(`Module ${moduleCode} inactif, aucun élément de menu affiché`);
        this.updateCache(cacheKey, []);
        return [];
      }
      
      if (this.isCacheValid(MenuRepositoryImpl.ALL_ITEMS_KEY)) {
        let filteredItems = this._cachedItems[MenuRepositoryImpl.ALL_ITEMS_KEY]
          .filter(item => item.module_code === moduleCode);
        
        if (!isAdmin) {
          filteredItems = filteredItems.filter(item => 
            !item.requires_admin && item.is_visible !== false
          );
        }
        
        this.updateCache(cacheKey, filteredItems);
        console.log(`Repository: Filtered ${filteredItems.length} items for module ${moduleCode} from cache`);
        return filteredItems;
      }
      
      const { data, error } = await MenuQueryBuilder.getItemsByModule(moduleCode, isAdmin);
      
      if (error) {
        console.error(`Repository error for module ${moduleCode}:`, error);
        throw error;
      }
      
      const items = data || [];
      this.updateCache(cacheKey, items);
      
      console.log(`Repository: Retrieved ${items.length} items for module ${moduleCode}`);
      return items;
    } catch (err) {
      console.error(`Exception lors du chargement des éléments de menu pour le module ${moduleCode}:`, err);
      throw err;
    }
  }
  
  /**
   * Get menu items by parent
   */
  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    try {
      const cacheKey = `${MenuRepositoryImpl.PARENT_PREFIX}${parentId || 'root'}`;
      
      if (this.isCacheValid(cacheKey)) {
        console.log(`Repository: Using cached menu items for parent: ${parentId || 'root'}`);
        return this._cachedItems[cacheKey];
      }
      
      console.log(`Repository: Fetching menu items with parent_id: ${parentId || 'root'}`);
      
      if (this.isCacheValid(MenuRepositoryImpl.ALL_ITEMS_KEY)) {
        const filteredItems = this._cachedItems[MenuRepositoryImpl.ALL_ITEMS_KEY].filter(item => {
          if (parentId === null) {
            return item.parent_id === null || !item.parent_id;
          }
          return item.parent_id === parentId;
        });
        
        this.updateCache(cacheKey, filteredItems);
        console.log(`Repository: Filtered ${filteredItems.length} child items for parent ${parentId || 'root'} from cache`);
        return filteredItems;
      }
      
      const { data, error } = await MenuQueryBuilder.getItemsByParent(parentId);
        
      if (error) {
        console.error(`Repository error for parent ${parentId}:`, error);
        throw error;
      }
      
      const items = data || [];
      this.updateCache(cacheKey, items);
      
      console.log(`Repository: Retrieved ${items.length} child menu items for parent ${parentId || 'root'}`);
      return items;
    } catch (error) {
      console.error(`Erreur lors de la récupération des éléments de menu pour le parent ${parentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new menu item
   */
  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    try {
      const { data, error } = await MenuQueryBuilder.createItem(item);
        
      if (error) {
        console.error('Error creating menu item:', error);
        return null;
      }
      
      this.resetCache();
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la création d\'un élément de menu:', error);
      return null;
    }
  }
  
  /**
   * Update an existing menu item
   */
  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    try {
      const { data, error } = await MenuQueryBuilder.updateItem(id, updates);
        
      if (error) {
        console.error(`Error updating menu item ${id}:`, error);
        return null;
      }
      
      this.resetCache();
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'élément de menu ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Delete a menu item
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const { error } = await MenuQueryBuilder.deleteItem(id);
        
      if (error) {
        console.error(`Error deleting menu item ${id}:`, error);
        return false;
      }
      
      this.resetCache();
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'élément de menu ${id}:`, error);
      return false;
    }
  }
}
