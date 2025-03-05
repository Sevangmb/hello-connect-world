
import { MenuUseCase } from '../application/MenuUseCase';
import { MenuRepository } from './SupabaseMenuRepository';

let menuService: MenuUseCase | null = null;

/**
 * Get or create a menu service instance
 * @returns MenuUseCase
 */
export const getMenuService = (): MenuUseCase => {
  if (!menuService) {
    const menuRepository = new MenuRepository();
    menuService = new MenuUseCase(menuRepository);
  }
  
  return menuService;
};
