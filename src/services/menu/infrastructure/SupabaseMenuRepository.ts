
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemCategory } from "../types";
import { IMenuRepository } from "../domain/interfaces/IMenuRepository";

/**
 * Implémentation Supabase du repository de menu
 * Couche Infrastructure de la Clean Architecture
 */
export class SupabaseMenuRepository implements IMenuRepository {
  /**
   * Récupère tous les éléments de menu
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) {
      console.error("Erreur lors de la récupération des éléments de menu:", error);
      throw error;
    }
    
    return data as MenuItem[] || [];
  }
  
  /**
   * Récupère les éléments de menu visibles pour un utilisateur
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  async getVisibleMenuItems(isAdmin: boolean): Promise<MenuItem[]> {
    const query = supabase
      .from('menu_items')
      .select('*')
      .eq('is_visible', true)
      .eq('is_active', true)
      .order('position', { ascending: true });
    
    if (!isAdmin) {
      query.eq('requires_admin', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Erreur lors de la récupération des éléments de menu:", error);
      throw error;
    }
    
    return data as MenuItem[] || [];
  }
  
  /**
   * Récupère les éléments de menu d'une catégorie spécifique
   * @param category Catégorie des éléments de menu
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  async getMenuItemsByCategory(category: MenuItemCategory, isAdmin: boolean): Promise<MenuItem[]> {
    const query = supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .eq('is_visible', true)
      .eq('is_active', true)
      .order('position', { ascending: true });
    
    if (!isAdmin) {
      query.eq('requires_admin', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Erreur lors de la récupération des éléments de menu pour la catégorie ${category}:`, error);
      throw error;
    }
    
    return data as MenuItem[] || [];
  }
  
  /**
   * Récupère les éléments de menu avec le code de module spécifié
   * @param moduleCode Code du module
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean): Promise<MenuItem[]> {
    const query = supabase
      .from('menu_items')
      .select('*')
      .eq('module_code', moduleCode)
      .eq('is_visible', true)
      .eq('is_active', true)
      .order('position', { ascending: true });
    
    if (!isAdmin) {
      query.eq('requires_admin', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Erreur lors de la récupération des éléments de menu pour le module ${moduleCode}:`, error);
      throw error;
    }
    
    return data as MenuItem[] || [];
  }
  
  /**
   * Met à jour un élément de menu
   * @param menuItem Élément de menu à mettre à jour
   */
  async updateMenuItem(menuItem: Partial<MenuItem> & { id: string }): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .update(menuItem)
      .eq('id', menuItem.id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de l'élément de menu:`, error);
      throw error;
    }
    
    return data as MenuItem;
  }
  
  /**
   * Crée un nouvel élément de menu
   * @param menuItem Élément de menu à créer
   */
  async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItem)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la création de l'élément de menu:`, error);
      throw error;
    }
    
    return data as MenuItem;
  }
  
  /**
   * Supprime un élément de menu
   * @param id Identifiant de l'élément de menu
   */
  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression de l'élément de menu:`, error);
      throw error;
    }
  }
  
  /**
   * Met à jour les positions des éléments de menu
   * @param updates Tableau de mises à jour avec ID et nouvelle position
   */
  async updateMenuPositions(updates: { id: string; position: number }[]): Promise<void> {
    // Traiter les mises à jour une par une car Supabase ne prend pas en charge 
    // les mises à jour en masse avec conditions multiples
    for (const update of updates) {
      const { error } = await supabase
        .from('menu_items')
        .update({ position: update.position })
        .eq('id', update.id);
      
      if (error) {
        console.error(`Erreur lors de la mise à jour de la position du menu ${update.id}:`, error);
        throw error;
      }
    }
  }
}
