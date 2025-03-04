
import { SupabaseMenuRepository } from './SupabaseMenuRepository';
import { MenuUseCase } from '../application/MenuUseCase';
import { MenuCacheService } from '../application/MenuCacheService';
import { MenuTreeBuilder } from '../application/MenuTreeBuilder';

// Create single instances for the application
const menuRepository = new SupabaseMenuRepository();
const menuTreeBuilder = new MenuTreeBuilder();
const menuCacheService = new MenuCacheService();
const menuUseCase = new MenuUseCase(menuRepository, menuCacheService, menuTreeBuilder);

// Export the MenuService with all the methods needed
export const MenuService = {
  // Menu items
  getMenuItemsByCategory: (category, isAdmin) => 
    menuUseCase.getMenuItemsByCategory(category, isAdmin),
  getMenuItemsByModule: (moduleCode, isAdmin) => 
    menuUseCase.getMenuItemsByModule(moduleCode, isAdmin),
  getVisibleMenuItems: (isAdmin) => 
    menuUseCase.getVisibleMenuItems(isAdmin),
  getAllMenuItems: () => 
    menuUseCase.getAllMenuItems(),
  
  // Menu tree
  buildMenuTree: (items) => 
    menuTreeBuilder.buildMenuTree(items),
  
  // CRUD operations
  createMenuItem: (item) => 
    menuUseCase.createMenuItem(item),
  updateMenuItem: (item) => 
    menuUseCase.updateMenuItem(item),
  deleteMenuItem: (id) => 
    menuUseCase.deleteMenuItem(id),
  
  // Cache operations
  clearMenuCache: () => 
    menuCacheService.clearCache(),
};
