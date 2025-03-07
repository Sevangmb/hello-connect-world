
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
    // Utiliser un cast plus direct pour résoudre l'erreur de type
    // TypeScript ne peut pas inférer que nous faisons une requête SQL où category est juste une colonne
    return supabase
      .from('menu_items')
      .select('*')
      .eq('category', category as unknown as any) // Cast direct pour éviter l'erreur TypeScript
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
    // Créer une copie de l'objet avec category comme string pour Supabase
    // Utiliser type assertion pour résoudre le problème de type
    const itemForDb = {
      ...item,
      // Forcer le type de la catégorie à any puis à string pour Supabase
      category: item.category ? (item.category as any) : undefined
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
    // Créer une copie de l'objet pour les mises à jour
    const updatesForDb = {
      ...updates,
      // Forcer le type de la catégorie à any puis à string pour Supabase
      category: updates.category ? (updates.category as any) : undefined
    };

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
