
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
    // Convertir la catégorie en string simple pour éviter les problèmes de typage avec Supabase
    const categoryAsString = String(category);
    
    return supabase
      .from('menu_items')
      .select('*')
      .eq('category', categoryAsString as any) // Utiliser le cast pour éviter l'erreur TypeScript
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
    // Traiter la catégorie pour s'assurer qu'elle est compatible avec Supabase
    const itemForDb = {
      ...item,
      // Convertir la catégorie en string pour éviter les problèmes de typage
      category: item.category ? String(item.category) : undefined
    };
    
    return supabase
      .from('menu_items')
      .insert([itemForDb as any]) // Utiliser le cast pour éviter l'erreur TypeScript
      .select()
      .single();
  }
  
  /**
   * Met à jour un élément de menu
   */
  static async updateItem(id: string, updates: UpdateMenuItemParams) {
    // Traiter la catégorie pour s'assurer qu'elle est compatible avec Supabase
    const updatesForDb = {
      ...updates,
      // Convertir la catégorie en string pour éviter les problèmes de typage
      category: updates.category ? String(updates.category) : undefined
    };

    return supabase
      .from('menu_items')
      .update(updatesForDb as any) // Utiliser le cast pour éviter l'erreur TypeScript
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
