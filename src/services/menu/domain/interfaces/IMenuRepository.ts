
import { MenuItem, MenuItemCategory } from "../../types";

/**
 * Interface du repository pour les opérations de menu
 * Couche Infrastructure de la Clean Architecture
 */
export interface IMenuRepository {
  /**
   * Récupère tous les éléments de menu
   */
  getAllMenuItems(): Promise<MenuItem[]>;
  
  /**
   * Récupère les éléments de menu visibles pour un utilisateur
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  getVisibleMenuItems(isAdmin: boolean): Promise<MenuItem[]>;
  
  /**
   * Récupère les éléments de menu d'une catégorie spécifique
   * @param category Catégorie des éléments de menu
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  getMenuItemsByCategory(category: MenuItemCategory, isAdmin: boolean): Promise<MenuItem[]>;
  
  /**
   * Récupère les éléments de menu avec le code de module spécifié
   * @param moduleCode Code du module
   * @param isAdmin Indique si l'utilisateur est administrateur
   */
  getMenuItemsByModule(moduleCode: string, isAdmin: boolean): Promise<MenuItem[]>;
  
  /**
   * Met à jour un élément de menu
   * @param menuItem Élément de menu à mettre à jour
   */
  updateMenuItem(menuItem: Partial<MenuItem> & { id: string }): Promise<MenuItem>;
  
  /**
   * Crée un nouvel élément de menu
   * @param menuItem Élément de menu à créer
   */
  createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem>;
  
  /**
   * Supprime un élément de menu
   * @param id Identifiant de l'élément de menu
   */
  deleteMenuItem(id: string): Promise<void>;
  
  /**
   * Met à jour les positions des éléments de menu
   * @param updates Tableau de mises à jour avec ID et nouvelle position
   */
  updateMenuPositions(updates: { id: string; position: number }[]): Promise<void>;
}
