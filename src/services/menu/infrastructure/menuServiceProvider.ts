
import { MenuUseCase } from '../application/MenuUseCase';
import { MenuRepository } from './SupabaseMenuRepository';

// Singleton instance
let menuRepository: MenuRepository | null = null;
let menuUseCase: MenuUseCase | null = null;

export const getMenuService = (): MenuUseCase => {
  if (!menuUseCase) {
    if (!menuRepository) {
      menuRepository = new MenuRepository();
    }
    menuUseCase = new MenuUseCase(menuRepository);
  }
  return menuUseCase;
};
