
import { supabase } from '@/integrations/supabase/client';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from '../types';

export class MenuRepository implements IMenuRepository {
  private _cachedAllItems: MenuItem[] | null = null;
  private _cachedCategories: Record<string, MenuItem[]> = {};
  private _cachedModules: Record<string, MenuItem[]> = {};
  private _cachedParents: Record<string, MenuItem[]> = {};
  private _lastCacheTime = 0;
  
  private readonly CACHE_TTL = 10000;
  
  private isCacheValid(): boolean {
    return this._cachedAllItems !== null && Date.now() - this._lastCacheTime < this.CACHE_TTL;
  }
  
  private resetCache(): void {
    this._cachedAllItems = null;
    this._cachedCategories = {};
    this._cachedModules = {};
    this._cachedParents = {};
    this._lastCacheTime = 0;
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      if (this.isCacheValid() && this._cachedAllItems) {
        console.log('Repository: Using cached menu items');
        return this._cachedAllItems;
      }
      
      console.log('Repository: Fetching all menu items');
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('position');
      
      if (error) {
        console.error('Repository error:', error);
        throw error;
      }
      
      this._cachedAllItems = data as MenuItem[] || [];
      this._lastCacheTime = Date.now();
      
      console.log(`Repository: Retrieved ${this._cachedAllItems.length} menu items`);
      return this._cachedAllItems;
    } catch (error) {
      console.error('Erreur lors de la récupération des éléments de menu:', error);
      throw error;
    }
  }

  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    try {
      if (this.isCacheValid() && this._cachedCategories[category]) {
        console.log(`Repository: Using cached menu items for category: ${category}`);
        return this._cachedCategories[category];
      }
      
      console.log(`Repository: Fetching menu items for category: ${category}`);
      
      if (this.isCacheValid() && this._cachedAllItems) {
        const filteredItems = this._cachedAllItems.filter(item => item.category === category);
        this._cachedCategories[category] = filteredItems;
        console.log(`Repository: Filtered ${filteredItems.length} items for category ${category} from cache`);
        return filteredItems;
      }
      
      // Fix: Remove the generic type parameter that's causing the infinite recursion
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .eq('category', category)
        .order('position');
      
      if (error) {
        console.error(`Repository error for category ${category}:`, error);
        throw error;
      }
      
      const items = data as MenuItem[] || [];
      this._cachedCategories[category] = items;
      
      console.log(`Repository: Retrieved ${items.length} menu items for category ${category}`);
      return items;
    } catch (error) {
      console.error(`Erreur lors de la récupération des éléments de menu pour la catégorie ${category}:`, error);
      throw error;
    }
  }

  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    try {
      const cacheKey = `${moduleCode}_${isAdmin ? 'admin' : 'user'}`;
      
      if (this.isCacheValid() && this._cachedModules[cacheKey]) {
        console.log(`Repository: Using cached menu items for module: ${moduleCode}`);
        return this._cachedModules[cacheKey];
      }
      
      console.log(`Repository: Fetching items for module ${moduleCode}, isAdmin: ${isAdmin}`);
      const isModuleActive = await moduleApiGateway.isModuleActive(moduleCode);
      
      if (!isModuleActive && !isAdmin && moduleCode !== 'admin' && !moduleCode.startsWith('admin_')) {
        console.log(`Module ${moduleCode} inactif, aucun élément de menu affiché`);
        this._cachedModules[cacheKey] = [];
        return [];
      }
      
      if (this.isCacheValid() && this._cachedAllItems) {
        let filteredItems = this._cachedAllItems.filter(item => item.module_code === moduleCode);
        
        if (!isAdmin) {
          filteredItems = filteredItems.filter(item => 
            !item.requires_admin && item.is_visible !== false
          );
        }
        
        this._cachedModules[cacheKey] = filteredItems;
        console.log(`Repository: Filtered ${filteredItems.length} items for module ${moduleCode} from cache`);
        return filteredItems;
      }
      
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('module_code', moduleCode)
        .eq('is_active', true)
        .order('position', { ascending: true });
      
      if (!isAdmin) {
        query = query.eq('requires_admin', false).eq('is_visible', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Repository error for module ${moduleCode}:`, error);
        throw error;
      }
      
      const items = data || [];
      this._cachedModules[cacheKey] = items;
      
      console.log(`Repository: Retrieved ${items.length} items for module ${moduleCode}`);
      return items;
    } catch (err) {
      console.error(`Exception lors du chargement des éléments de menu pour le module ${moduleCode}:`, err);
      throw err;
    }
  }
  
  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    try {
      const cacheKey = parentId || 'root';
      
      if (this.isCacheValid() && this._cachedParents[cacheKey]) {
        console.log(`Repository: Using cached menu items for parent: ${parentId || 'root'}`);
        return this._cachedParents[cacheKey];
      }
      
      console.log(`Repository: Fetching menu items with parent_id: ${parentId || 'root'}`);
      
      if (this.isCacheValid() && this._cachedAllItems) {
        const filteredItems = this._cachedAllItems.filter(item => {
          if (parentId === null) {
            return item.parent_id === null || !item.parent_id;
          }
          return item.parent_id === parentId;
        });
        
        this._cachedParents[cacheKey] = filteredItems;
        console.log(`Repository: Filtered ${filteredItems.length} child items for parent ${parentId || 'root'} from cache`);
        return filteredItems;
      }
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('parent_id', parentId)
        .eq('is_active', true)
        .order('position', { ascending: true });
        
      if (error) {
        console.error(`Repository error for parent ${parentId}:`, error);
        throw error;
      }
      
      const items = data || [];
      this._cachedParents[cacheKey] = items;
      
      console.log(`Repository: Retrieved ${items.length} child menu items for parent ${parentId || 'root'}`);
      return items;
    } catch (error) {
      console.error(`Erreur lors de la récupération des éléments de menu pour le parent ${parentId}:`, error);
      throw error;
    }
  }
  
  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item as any])
        .select()
        .single();
        
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
  
  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
        
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
  
  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
        
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

export const menuRepository = new MenuRepository();
