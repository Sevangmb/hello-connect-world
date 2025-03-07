
import { MenuItem, CreateMenuItemParams, UpdateMenuItemParams } from '../../types';
import { BaseMenuUseCase } from './BaseMenuUseCase';

/**
 * Cas d'utilisation pour les opérations d'écriture de menu
 * Se concentre uniquement sur la création, mise à jour et suppression des éléments de menu
 */
export class MenuWriteUseCase extends BaseMenuUseCase {
  /**
   * Crée un nouvel élément de menu
   */
  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    return this.menuRepository.createMenuItem(item);
  }

  /**
   * Met à jour un élément de menu existant
   */
  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    return this.menuRepository.updateMenuItem(id, updates);
  }

  /**
   * Supprime un élément de menu
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    return this.menuRepository.deleteMenuItem(id);
  }
}
