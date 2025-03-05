
import { IMenuRepository } from "../domain/interfaces/IMenuRepository";
import { MenuUseCase } from "../application/MenuUseCase";
import { SupabaseMenuRepository } from "./SupabaseMenuRepository";

// Create singleton instances
let menuRepository: IMenuRepository | null = null;
let menuUseCase: MenuUseCase | null = null;

/**
 * Get the menu repository instance (singleton)
 */
export const getMenuRepository = (): IMenuRepository => {
  if (!menuRepository) {
    menuRepository = new SupabaseMenuRepository();
  }
  return menuRepository;
};

/**
 * Get the menu use case instance (singleton)
 */
export const getMenuUseCase = (): MenuUseCase => {
  if (!menuUseCase) {
    const repository = getMenuRepository();
    menuUseCase = new MenuUseCase(repository);
  }
  return menuUseCase;
};
