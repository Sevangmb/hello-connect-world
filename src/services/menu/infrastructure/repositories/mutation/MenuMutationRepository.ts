
import { MenuCacheService } from '../../services/MenuCacheService';
import { MenuQueryBuilder } from '../../utils/MenuQueryBuilder';
import { MenuItem, CreateMenuItemParams, UpdateMenuItemParams } from '../../../types';

/**
 * Repository pour les mutations (création, mise à jour, suppression) des éléments de menu
 */
export class MenuMutationRepository {
  constructor(private cacheService: MenuCacheService) {}

  /**
   * Crée un nouvel élément de menu
   */
  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    try {
      const { data, error } = await MenuQueryBuilder.createItem(item);
        
      if (error) {
        console.error('Error creating menu item:', error);
        return null;
      }
      
      this.cacheService.resetCache();
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la création d\'un élément de menu:', error);
      return null;
    }
  }
  
  /**
   * Met à jour un élément de menu existant
   */
  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    try {
      const { data, error } = await MenuQueryBuilder.updateItem(id, updates);
        
      if (error) {
        console.error(`Error updating menu item ${id}:`, error);
        return null;
      }
      
      this.cacheService.resetCache();
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'élément de menu ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Supprime un élément de menu
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const { error } = await MenuQueryBuilder.deleteItem(id);
        
      if (error) {
        console.error(`Error deleting menu item ${id}:`, error);
        return false;
      }
      
      this.cacheService.resetCache();
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'élément de menu ${id}:`, error);
      return false;
    }
  }
}
