
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, MenuItemCategory } from '../../types';

/**
 * Builder for menu item queries to Supabase
 */
export class MenuQueryBuilder {
  /**
   * Get all active menu items
   */
  static getAllItems() {
    return supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true)
      .order('position');
  }
  
  /**
   * Get menu items by category
   */
  static getItemsByCategory(category: MenuItemCategory) {
    return supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true)
      .eq('category', category as any) // Using 'as any' to bypass TypeScript's strict typing
      .order('position');
  }
  
  /**
   * Get menu items by module
   */
  static getItemsByModule(moduleCode: string, isAdmin: boolean = false) {
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('module_code', moduleCode)
      .eq('is_active', true)
      .order('position', { ascending: true });
    
    if (!isAdmin) {
      query = query.eq('requires_admin', false).eq('is_visible', true);
    }
    
    return query;
  }
  
  /**
   * Get menu items by parent id
   */
  static getItemsByParent(parentId: string | null) {
    return supabase
      .from('menu_items')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('position', { ascending: true });
  }
  
  /**
   * Create a new menu item
   */
  static createItem(item: any) {
    return supabase
      .from('menu_items')
      .insert([item])
      .select()
      .single();
  }
  
  /**
   * Update an existing menu item
   */
  static updateItem(id: string, updates: any) {
    return supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  }
  
  /**
   * Delete a menu item
   */
  static deleteItem(id: string) {
    return supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
  }
}
