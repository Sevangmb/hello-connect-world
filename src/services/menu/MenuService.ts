
/**
 * Service pour la gestion des menus dynamiques
 * Implémente l'architecture Clean dans le microservice Menu
 */
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemCategory } from "./types";
import { CACHE_VALIDITY_MS, MENU_MODULE_CODE } from "@/hooks/modules/constants";

// Repository Layer
class MenuRepository {
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

// UseCase Layer
class MenuUseCase {
  private repository: MenuRepository;
  private cache: {
    items: MenuItem[];
    timestamp: number;
  } = {
    items: [],
    timestamp: 0
  };
  
  constructor() {
    this.repository = new MenuRepository();
  }
  
  /**
   * Récupère tous les éléments de menu avec gestion du cache
   * @param useCache Indique si le cache doit être utilisé
   */
  async getAllMenuItems(useCache = true): Promise<MenuItem[]> {
    // Vérifier si le cache est valide
    const now = Date.now();
    if (useCache && this.cache.items.length > 0 && (now - this.cache.timestamp) < CACHE_VALIDITY_MS) {
      return this.cache.items;
    }
    
    try {
      const items = await this.repository.getAllMenuItems();
      
      // Mettre à jour le cache
      this.cache = {
        items,
        timestamp: now
      };
      
      return items;
    } catch (error) {
      // En cas d'erreur, utiliser le cache même s'il est expiré
      if (this.cache.items.length > 0) {
        console.warn("Utilisation du cache expiré pour les éléments de menu en raison d'une erreur");
        return this.cache.items;
      }
      throw error;
    }
  }
  
  /**
   * Récupère les éléments de menu visibles pour un utilisateur
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  async getVisibleMenuItems(isAdmin: boolean): Promise<MenuItem[]> {
    return this.repository.getVisibleMenuItems(isAdmin);
  }
  
  /**
   * Récupère les éléments de menu par catégorie
   * @param category Catégorie des éléments de menu
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  async getMenuItemsByCategory(category: MenuItemCategory, isAdmin: boolean): Promise<MenuItem[]> {
    return this.repository.getMenuItemsByCategory(category, isAdmin);
  }
  
  /**
   * Organise les éléments de menu sous forme d'arborescence
   * @param menuItems Liste plate des éléments de menu
   */
  buildMenuTree(menuItems: MenuItem[]): MenuItem[] {
    const itemsMap = new Map<string, MenuItem & { children?: MenuItem[] }>();
    const rootItems: (MenuItem & { children?: MenuItem[] })[] = [];
    
    // Créer une map pour un accès rapide aux éléments
    menuItems.forEach(item => {
      itemsMap.set(item.id, { ...item, children: [] });
    });
    
    // Construire l'arborescence
    menuItems.forEach(item => {
      const menuItem = itemsMap.get(item.id)!;
      
      if (item.parent_id && itemsMap.has(item.parent_id)) {
        // Ajouter l'élément au parent
        const parent = itemsMap.get(item.parent_id)!;
        parent.children = parent.children || [];
        parent.children.push(menuItem);
      } else {
        // Ajouter l'élément à la racine
        rootItems.push(menuItem);
      }
    });
    
    return rootItems;
  }
  
  /**
   * Met à jour un élément de menu
   * @param menuItem Élément de menu à mettre à jour
   */
  async updateMenuItem(menuItem: Partial<MenuItem> & { id: string }): Promise<MenuItem> {
    const updatedItem = await this.repository.updateMenuItem(menuItem);
    
    // Invalider le cache
    this.cache.timestamp = 0;
    
    return updatedItem;
  }
  
  /**
   * Crée un nouvel élément de menu
   * @param menuItem Élément de menu à créer
   */
  async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const newItem = await this.repository.createMenuItem(menuItem);
    
    // Invalider le cache
    this.cache.timestamp = 0;
    
    return newItem;
  }
  
  /**
   * Supprime un élément de menu
   * @param id Identifiant de l'élément de menu
   */
  async deleteMenuItem(id: string): Promise<void> {
    await this.repository.deleteMenuItem(id);
    
    // Invalider le cache
    this.cache.timestamp = 0;
  }
  
  /**
   * Met à jour les positions des éléments de menu
   * @param updates Tableau de mises à jour avec ID et nouvelle position
   */
  async updateMenuPositions(updates: { id: string; position: number }[]): Promise<void> {
    await this.repository.updateMenuPositions(updates);
    
    // Invalider le cache
    this.cache.timestamp = 0;
  }
}

// Singleton instance
const menuUseCase = new MenuUseCase();

// Service export
export const MenuService = {
  getAllMenuItems: () => menuUseCase.getAllMenuItems(),
  getVisibleMenuItems: (isAdmin: boolean) => menuUseCase.getVisibleMenuItems(isAdmin),
  getMenuItemsByCategory: (category: MenuItemCategory, isAdmin: boolean) => menuUseCase.getMenuItemsByCategory(category, isAdmin),
  getMenuItemsByModule: (moduleCode: string, isAdmin: boolean) => new MenuRepository().getMenuItemsByModule(moduleCode, isAdmin),
  buildMenuTree: (menuItems: MenuItem[]) => menuUseCase.buildMenuTree(menuItems),
  updateMenuItem: (menuItem: Partial<MenuItem> & { id: string }) => menuUseCase.updateMenuItem(menuItem),
  createMenuItem: (menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => menuUseCase.createMenuItem(menuItem),
  deleteMenuItem: (id: string) => menuUseCase.deleteMenuItem(id),
  updateMenuPositions: (updates: { id: string; position: number }[]) => menuUseCase.updateMenuPositions(updates)
};
