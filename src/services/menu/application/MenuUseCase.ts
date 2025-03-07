
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from '../types';

export class MenuUseCase {
  constructor(private menuRepository: IMenuRepository) {}

  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.menuRepository.getAllMenuItems();
  }

  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    return this.menuRepository.getMenuItemsByCategory(category);
  }

  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    return this.menuRepository.getMenuItemsByModule(moduleCode, isAdmin);
  }

  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    return this.menuRepository.getMenuItemsByParent(parentId);
  }

  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    return this.menuRepository.createMenuItem(item);
  }

  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    return this.menuRepository.updateMenuItem(id, updates);
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return this.menuRepository.deleteMenuItem(id);
  }
}
