import { supabase } from '@/integrations/supabase/client';
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuItem, MenuType } from '../types';

export class MenuRepository implements IMenuRepository {
  async getMenuItems(menuType: MenuType): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('menu_type', menuType)
      .order('order');
      
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    return data || [];
  }

  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('parent_id', parentId)
      .order('order');
      
    if (error) {
      console.error('Error fetching child menu items:', error);
      throw error;
    }
    
    return data || [];
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }

    return data as MenuItem[];
  }

  async getMenuItemsByCategory(category: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('category', category as any);

    if (!isAdmin) {
      query = query.eq('requires_admin', false);
    }

    const { data, error } = await query.order('position', { ascending: true });

    if (error) {
      console.error('Error fetching menu items by category:', error);
      return [];
    }

    return data as MenuItem[];
  }

  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('module_code', moduleCode);

    if (!isAdmin) {
      query = query.eq('requires_admin', false);
    }

    const { data, error } = await query.order('position', { ascending: true });

    if (error) {
      console.error('Error fetching menu items by module:', error);
      return [];
    }

    return data as MenuItem[];
  }

  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
      return null;
    }

    return data as MenuItem;
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu item:', error);
      return null;
    }

    return data as MenuItem;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu item:', error);
      return false;
    }

    return true;
  }
}

export const menuRepository = new MenuRepository();
