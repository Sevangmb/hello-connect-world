
import { supabase } from '@/integrations/supabase/client';
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from '../types';

export class MenuRepository implements IMenuRepository {
  async getAllMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('position');
    
    if (error) throw error;
    return data as MenuItem[];
  }

  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    // We need to typecast the category to ensure it works with Supabase's typing system
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category as any) // Changed from `as string` to `as any` to avoid TypeScript error
      .order('position');
    
    if (error) throw error;
    return data as MenuItem[];
  }

  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
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
      console.error(`Error fetching menu items for module ${moduleCode}:`, error);
      return [];
    }
    
    return data;
  }
  
  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('position', { ascending: true });
      
    if (error) {
      console.error(`Error fetching menu items for parent ${parentId}:`, error);
      return [];
    }
    
    return data;
  }
  
  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    // Use type assertion to handle category type differences
    const { data, error } = await supabase
      .from('menu_items')
      .insert([item as any]) // Use type assertion here
      .select()
      .single();
      
    if (error) {
      console.error('Error creating menu item:', error);
      return null;
    }
    
    return data;
  }
  
  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    // Use type assertion to handle category type differences
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates as any) // Use type assertion here
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating menu item ${id}:`, error);
      return null;
    }
    
    return data;
  }
  
  async deleteMenuItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting menu item ${id}:`, error);
      return false;
    }
    
    return true;
  }
}

export const menuRepository = new MenuRepository();
