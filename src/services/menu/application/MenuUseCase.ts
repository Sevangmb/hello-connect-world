
import { IMenuRepository } from "../domain/interfaces/IMenuRepository";
import { MenuItem, MenuItemCategory } from "../types";

/**
 * Menu use case - Application layer
 * Implements business logic for menu operations
 */
export class MenuUseCase {
  private repository: IMenuRepository;

  constructor(repository: IMenuRepository) {
    this.repository = repository;
  }

  /**
   * Get all menu items
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      return await this.repository.getAllMenuItems();
    } catch (error) {
      console.error("Error fetching all menu items:", error);
      return [];
    }
  }

  /**
   * Get menu items by category
   */
  async getMenuItemsByCategory(category: string, isAdmin?: boolean): Promise<MenuItem[]> {
    try {
      return await this.repository.getMenuItemsByCategory(category, isAdmin);
    } catch (error) {
      console.error(`Error fetching menu items for category ${category}:`, error);
      return [];
    }
  }

  /**
   * Get menu items by module
   */
  async getMenuItemsByModule(moduleCode: string, isAdmin?: boolean): Promise<MenuItem[]> {
    try {
      return await this.repository.getMenuItemsByModule(moduleCode, isAdmin);
    } catch (error) {
      console.error(`Error fetching menu items for module ${moduleCode}:`, error);
      return [];
    }
  }

  /**
   * Get menu items by parent ID
   */
  async getMenuItemsByParent(parentId: string): Promise<MenuItem[]> {
    try {
      return await this.repository.getMenuItemsByParent(parentId);
    } catch (error) {
      console.error(`Error fetching menu items for parent ${parentId}:`, error);
      return [];
    }
  }

  /**
   * Create a new menu item
   */
  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null> {
    try {
      return await this.repository.createMenuItem(item);
    } catch (error) {
      console.error("Error creating menu item:", error);
      return null;
    }
  }

  /**
   * Update an existing menu item
   */
  async updateMenuItem(item: Partial<MenuItem> & { id: string }): Promise<MenuItem | null> {
    try {
      return await this.repository.updateMenuItem(item);
    } catch (error) {
      console.error(`Error updating menu item ${item.id}:`, error);
      return null;
    }
  }

  /**
   * Delete a menu item
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      return await this.repository.deleteMenuItem(id);
    } catch (error) {
      console.error(`Error deleting menu item ${id}:`, error);
      return false;
    }
  }
}
