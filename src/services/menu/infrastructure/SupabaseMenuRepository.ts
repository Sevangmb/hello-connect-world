
import { supabase } from '@/integrations/supabase/client';
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuItem } from '../types';

export class MenuRepository implements IMenuRepository {
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('position', { ascending: true });
        
      if (error) {
        console.error('Error fetching menu items:', error);
        return [];
      }
      
      return data as MenuItem[];
    } catch (err) {
      console.error('Exception fetching menu items:', err);
      return [];
    }
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category', category)
        .order('position', { ascending: true });
        
      if (error) {
        console.error('Error fetching menu items by category:', error);
        return [];
      }
      
      return data as MenuItem[];
    } catch (err) {
      console.error('Exception fetching menu items by category:', err);
      return [];
    }
  }

  async getMenuItemsByModule(moduleCode: string): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('module_code', moduleCode)
        .order('position', { ascending: true });
        
      if (error) {
        console.error('Error fetching menu items by module:', error);
        return [];
      }
      
      return data as MenuItem[];
    } catch (err) {
      console.error('Exception fetching menu items by module:', err);
      return [];
    }
  }
  
  async getAdminMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('requires_admin', true)
        .order('position', { ascending: true });
        
      if (error) {
        console.error('Error fetching admin menu items:', error);
        return [];
      }
      
      return data as MenuItem[];
    } catch (err) {
      console.error('Exception fetching admin menu items:', err);
      return [];
    }
  }
  
  async setMenuItemVisibility(itemId: string, isVisible: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_visible: isVisible })
        .eq('id', itemId);
        
      if (error) {
        console.error('Error updating menu item visibility:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Exception updating menu item visibility:', err);
      return false;
    }
  }

  async createMenuItem(menuItemData: any): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(menuItemData)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating menu item:', error);
        return null;
      }
      
      return data as MenuItem;
    } catch (err) {
      console.error('Exception creating menu item:', err);
      return null;
    }
  }

  async updateMenuItem(itemId: string, menuItemData: any): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(menuItemData)
        .eq('id', itemId)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating menu item:', error);
        return null;
      }
      
      return data as MenuItem;
    } catch (err) {
      console.error('Exception updating menu item:', err);
      return null;
    }
  }

  async deleteMenuItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);
        
      if (error) {
        console.error('Error deleting menu item:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Exception deleting menu item:', err);
      return false;
    }
  }
}

// Export an instance of the repository for easier usage
export const menuRepository = new MenuRepository();
