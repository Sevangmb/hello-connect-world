
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_MODULE_CODE } from '@/hooks/modules/constants';
import { MenuItem, MenuCategory } from './types';

// Constants
export const MENU_TYPE = {
  ADMIN: 'admin',
  USER: 'user',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
};

// Service class for menu management
export class MenuService {
  /**
   * Get the menu items for a specific type of menu
   */
  static async getMenuItems(menuType: string = MENU_TYPE.USER): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('menu_type', menuType)
        .order('order');
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return [];
    }
  }
  
  /**
   * Get menu categories
   */
  static async getMenuCategories(): Promise<MenuCategory[]> {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('order');
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching menu categories:", error);
      return [];
    }
  }
  
  /**
   * Save a new menu item
   */
  static async saveMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error saving menu item:", error);
      return null;
    }
  }
  
  /**
   * Update a menu item
   */
  static async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error updating menu item:", error);
      return false;
    }
  }
  
  /**
   * Delete a menu item
   */
  static async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error deleting menu item:", error);
      return false;
    }
  }
}
