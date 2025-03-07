
import { MenuItem, MenuItemCategory } from '../../types';
import { BaseMenuUseCase } from './BaseMenuUseCase';

/**
 * Cas d'utilisation pour les opérations de lecture de menu
 * Se concentre uniquement sur la récupération des éléments de menu
 */
export class MenuReadUseCase extends BaseMenuUseCase {
  /**
   * Récupère tous les éléments de menu
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.menuRepository.getAllMenuItems();
  }

  /**
   * Récupère les éléments de menu par catégorie
   */
  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    return this.menuRepository.getMenuItemsByCategory(category);
  }

  /**
   * Récupère les éléments de menu par module
   */
  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    return this.menuRepository.getMenuItemsByModule(moduleCode, isAdmin);
  }

  /**
   * Récupère les éléments de menu par parent
   */
  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    return this.menuRepository.getMenuItemsByParent(parentId);
  }
}
