
import { MenuItem } from '../../types';

export interface IMenuRepository {
  /**
   * Récupère tous les éléments de menu
   */
  getAllMenuItems(): Promise<MenuItem[]>;
  
  /**
   * Récupère les éléments de menu par catégorie
   */
  getMenuItemsByCategory(category: string, isAdmin: boolean): Promise<MenuItem[]>;
  
  /**
   * Récupère les éléments de menu par module
   */
  getMenuItemsByModule(moduleCode: string, isAdmin: boolean): Promise<MenuItem[]>;
  
  /**
   * Récupère les éléments de menu visibles
   */
  getVisibleMenuItems(isAdmin: boolean): Promise<MenuItem[]>;
  
  /**
   * Crée un nouvel élément de menu
   */
  createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem>;
  
  /**
   * Met à jour un élément de menu
   */
  updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem>;
  
  /**
   * Supprime un élément de menu
   */
  deleteMenuItem(id: string): Promise<boolean>;
}
