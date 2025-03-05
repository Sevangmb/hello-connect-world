import { supabase } from '@/integrations/supabase/client';
import { MenuItem, MenuCategory, MenuItemCategory } from './types';

/**
 * Service for managing menu items
 */
export class MenuService {
  /**
   * Get all menu categories from the database
   */
  async getAllCategories(): Promise<MenuCategory[]> {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as MenuCategory[];
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      return [];
    }
  }
  
  /**
   * Create a new menu item
   */
  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null> {
    try {
      const newItem = {
        name: item.name,
        path: item.path,
        icon: item.icon,
        description: item.description,
        parent_id: item.parent_id,
        position: item.position,
        category: item.category,
        module_code: item.module_code,
        is_active: item.is_active,
        is_visible: item.is_visible,
        requires_admin: item.requires_admin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('menu_items')
        .insert(newItem)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as MenuItem;
    } catch (error) {
      console.error('Error creating menu item:', error);
      return null;
    }
  }
  
  /**
   * Get all menu items from the database
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as MenuItem[];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }
  
  /**
   * Get menu items by category from the database
   */
  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category', category)
        .order('position', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as MenuItem[];
    } catch (error) {
      console.error(`Error fetching menu items by category ${category}:`, error);
      return [];
    }
  }
  
  /**
   * Get menu items by module from the database
   */
  async getMenuItemsByModule(moduleCode: string): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('module_code', moduleCode)
        .order('position', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as MenuItem[];
    } catch (error) {
      console.error(`Error fetching menu items by module ${moduleCode}:`, error);
      return [];
    }
  }
  
  /**
   * Get menu items by parent from the database
   */
  async getMenuItemsByParent(parentId: string): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('parent_id', parentId)
        .order('position', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as MenuItem[];
    } catch (error) {
      console.error(`Error fetching menu items by parent ${parentId}:`, error);
      return [];
    }
  }
  
  /**
   * Update a menu item in the database
   */
  async updateMenuItem(item: Partial<MenuItem> & { id: string }): Promise<MenuItem | null> {
    try {
      const { id, ...updates } = item;
      
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as MenuItem;
    } catch (error) {
      console.error('Error updating menu item:', error);
      return null;
    }
  }
  
  /**
   * Delete a menu item from the database
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const menuService = new MenuService();
