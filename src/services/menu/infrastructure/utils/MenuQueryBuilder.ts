
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from "../../types";

/**
 * Classe utilitaire pour construire des requêtes Supabase pour les menus
 */
export class MenuQueryBuilder {
  /**
   * Récupère tous les éléments de menu
   */
  static async getAllItems() {
    return supabase
      .from('menu_items')
      .select('*')
      .order('position', { ascending: true })
      .order('order', { ascending: true })
      .order('name', { ascending: true });
  }
  
  /**
   * Récupère les éléments de menu par catégorie
   */
  static async getItemsByCategory(category: MenuItemCategory) {
    return supabase
      .from('menu_items')
      .select('*')
      .eq('category', category as string) // Cast to string to satisfy Supabase API
      .order('position', { ascending: true })
      .order('order', { ascending: true })
      .order('name', { ascending: true });
  }
  
  /**
   * Récupère les éléments de menu par module
   */
  static async getItemsByModule(moduleCode: string, isAdmin: boolean = false) {
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('module_code', moduleCode)
      .order('position', { ascending: true })
      .order('order', { ascending: true })
      .order('name', { ascending: true });
      
    if (isAdmin) {
      // Si on recherche des éléments admin, ne pas filtrer par requires_admin
    } else {
      // Sinon, exclure les éléments qui nécessitent des privilèges admin
      query = query.eq('requires_admin', false);
    }
    
    return query;
  }
  
  /**
   * Récupère les éléments de menu par parent
   */
  static async getItemsByParent(parentId: string | null) {
    if (parentId === null) {
      return supabase
        .from('menu_items')
        .select('*')
        .is('parent_id', null)
        .order('position', { ascending: true })
        .order('order', { ascending: true })
        .order('name', { ascending: true });
    }
    
    return supabase
      .from('menu_items')
      .select('*')
      .eq('parent_id', parentId)
      .order('position', { ascending: true })
      .order('order', { ascending: true })
      .order('name', { ascending: true });
  }
  
  /**
   * Crée un élément de menu
   */
  static async createItem(item: CreateMenuItemParams) {
    return supabase
      .from('menu_items')
      .insert([{ ...item, category: item.category as string }]) // Cast to string for Supabase
      .select()
      .single();
  }
  
  /**
   * Met à jour un élément de menu
   */
  static async updateItem(id: string, updates: UpdateMenuItemParams) {
    // If category is present, we need to cast it
    const updatesWithStringCategory = {
      ...updates,
      ...(updates.category && { category: updates.category as string })
    };

    return supabase
      .from('menu_items')
      .update(updatesWithStringCategory)
      .eq('id', id)
      .select()
      .single();
  }
  
  /**
   * Supprime un élément de menu
   */
  static async deleteItem(id: string) {
    return supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
  }
}
