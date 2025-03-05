
import { MenuItem } from "../../types";

export interface IMenuRepository {
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string, isAdmin?: boolean): Promise<MenuItem[]>;
  getMenuItemsByModule(moduleCode: string, isAdmin?: boolean): Promise<MenuItem[]>;
  getMenuItemsByParent(parentId: string): Promise<MenuItem[]>;
  createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null>;
  updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null>;
  deleteMenuItem(id: string): Promise<boolean>;
}
