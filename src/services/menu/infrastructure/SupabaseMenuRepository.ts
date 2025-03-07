
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from '../types';
import { MenuRepositoryImpl } from './repositories/MenuRepositoryImpl';

/**
 * Menu repository implementation using Supabase
 */
export class MenuRepository implements IMenuRepository {
  private repository: MenuRepositoryImpl;
  
  constructor() {
    this.repository = new MenuRepositoryImpl();
  }
  
  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.repository.getAllMenuItems();
  }

  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    return this.repository.getMenuItemsByCategory(category);
  }

  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    return this.repository.getMenuItemsByModule(moduleCode, isAdmin);
  }
  
  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    return this.repository.getMenuItemsByParent(parentId);
  }
  
  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    return this.repository.createMenuItem(item);
  }
  
  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    return this.repository.updateMenuItem(id, updates);
  }
  
  async deleteMenuItem(id: string): Promise<boolean> {
    return this.repository.deleteMenuItem(id);
  }
}

// Create a singleton instance
export const menuRepository = new MenuRepository();
