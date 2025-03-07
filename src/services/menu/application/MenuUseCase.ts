
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuItem, MenuItemCategory } from '../types';

/**
 * MenuUseCase class for handling menu-related logic
 */
export class MenuUseCase {
  private menuRepository: IMenuRepository;

  constructor(menuRepository: IMenuRepository) {
    this.menuRepository = menuRepository;
  }

  /**
   * Get all menu items
   */
  async getAllMenuItems() {
    return await this.menuRepository.getAllMenuItems();
  }

  /**
   * Get menu items by category
   */
  async getMenuItemsByCategory(category: MenuItemCategory) {
    return await this.menuRepository.getMenuItemsByCategory(category);
  }

  /**
   * Get menu items by module
   */
  async getMenuItemsByModule(moduleCode: string) {
    return await this.menuRepository.getMenuItemsByModule(moduleCode);
  }

  /**
   * Get admin menu items
   */
  async getAdminMenuItems() {
    return await this.menuRepository.getMenuItemsByCategory('admin');
  }

  /**
   * Set menu item visibility
   */
  async setMenuItemVisibility(itemId: string, isVisible: boolean) {
    return await this.menuRepository.updateMenuItem(itemId, { is_visible: isVisible });
  }

  /**
   * Create a new menu item
   */
  async createMenuItem(menuItemData: any) {
    return await this.menuRepository.createMenuItem(menuItemData);
  }

  /**
   * Update a menu item
   */
  async updateMenuItem(itemId: string, menuItemData: any) {
    return await this.menuRepository.updateMenuItem(itemId, menuItemData);
  }

  /**
   * Delete a menu item
   */
  async deleteMenuItem(itemId: string) {
    return await this.menuRepository.deleteMenuItem(itemId);
  }
}
