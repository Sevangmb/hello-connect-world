
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
    // On doit traiter l'objet comme n'importe quel objet de type Record<string, any>
    // pour satisfaire l'API Supabase, tout en conservant les types dans notre code
    const itemForDb = {
      ...item,
      category: item.category as string // Cast explicite pour Supabase
    };
    
    return supabase
      .from('menu_items')
      .insert([itemForDb])
      .select()
      .single();
  }
  
  /**
   * Met à jour un élément de menu
   */
  static async updateItem(id: string, updates: UpdateMenuItemParams) {
    // Si la catégorie est présente, nous devons la caster
    const updatesForDb = {
      ...updates
    };
    
    // Si category est présent, le caster en string
    if (updates.category) {
      updatesForDb.category = updates.category as string;
    }

    return supabase
      .from('menu_items')
      .update(updatesForDb)
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
