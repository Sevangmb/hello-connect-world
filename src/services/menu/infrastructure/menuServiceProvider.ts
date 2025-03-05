
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { SupabaseMenuRepository } from './SupabaseMenuRepository';
import { MenuUseCase } from '../application/MenuUseCase';
import { MenuCacheService } from '../application/MenuCacheService';
import { MenuTreeBuilder } from '../application/MenuTreeBuilder';

// Create singleton instances
let menuRepository: IMenuRepository | null = null;
let menuCacheService: MenuCacheService | null = null;
let menuUseCase: MenuUseCase | null = null;
let menuTreeBuilder: MenuTreeBuilder | null = null;

/**
 * Get the menu repository instance
 */
export function getMenuRepository(): IMenuRepository {
  if (!menuRepository) {
    menuRepository = new SupabaseMenuRepository();
  }
  return menuRepository;
}

/**
 * Get the menu cache service instance
 */
export function getMenuCacheService(): MenuCacheService {
  if (!menuCacheService) {
    menuCacheService = new MenuCacheService();
  }
  return menuCacheService;
}

/**
 * Get the menu use case instance
 */
export function getMenuUseCase(): MenuUseCase {
  if (!menuUseCase) {
    menuUseCase = new MenuUseCase(
      getMenuRepository(),
      getMenuCacheService()
    );
  }
  return menuUseCase;
}

/**
 * Get the menu tree builder instance
 */
export function getMenuTreeBuilder(): MenuTreeBuilder {
  if (!menuTreeBuilder) {
    menuTreeBuilder = new MenuTreeBuilder();
  }
  return menuTreeBuilder;
}

/**
 * Clear all menu services caches
 */
export function clearMenuCaches(): void {
  if (menuCacheService) {
    menuCacheService.clearCache();
  }
}
