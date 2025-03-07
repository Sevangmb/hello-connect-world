
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from '../types';
import { MenuReadUseCase } from './usecases/MenuReadUseCase';
import { MenuWriteUseCase } from './usecases/MenuWriteUseCase';

/**
 * Cas d'utilisation principal du menu qui sert de façade pour toutes les opérations de menu
 * Délègue les opérations aux cas d'utilisation spécialisés
 */
export class MenuUseCase {
  private readUseCase: MenuReadUseCase;
  private writeUseCase: MenuWriteUseCase;

  constructor(private menuRepository: IMenuRepository) {
    this.readUseCase = new MenuReadUseCase(menuRepository);
    this.writeUseCase = new MenuWriteUseCase(menuRepository);
  }

  // Opérations de lecture
  
  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.readUseCase.getAllMenuItems();
  }

  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    return this.readUseCase.getMenuItemsByCategory(category);
  }

  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    return this.readUseCase.getMenuItemsByModule(moduleCode, isAdmin);
  }

  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    return this.readUseCase.getMenuItemsByParent(parentId);
  }

  // Opérations d'écriture
  
  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    return this.writeUseCase.createMenuItem(item);
  }

  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    return this.writeUseCase.updateMenuItem(id, updates);
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return this.writeUseCase.deleteMenuItem(id);
  }
}
