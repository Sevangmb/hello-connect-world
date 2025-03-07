
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from '../../types';

export interface IMenuRepository {
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]>;
  getMenuItemsByModule(moduleCode: string, isAdmin?: boolean): Promise<MenuItem[]>;
  getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]>;
  createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null>;
  updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null>;
  deleteMenuItem(id: string): Promise<boolean>;
}
