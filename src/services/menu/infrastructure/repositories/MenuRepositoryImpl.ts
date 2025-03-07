
import { IMenuRepository } from '../../domain/interfaces/IMenuRepository';
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from '../../types';
import { MenuCacheService } from '../services/MenuCacheService';
import { AllMenuItemsRepository } from './query/AllMenuItemsRepository';
import { CategoryMenuItemsRepository } from './query/CategoryMenuItemsRepository';
import { ModuleMenuItemsRepository } from './query/ModuleMenuItemsRepository';
import { ParentMenuItemsRepository } from './query/ParentMenuItemsRepository';
import { MenuMutationRepository } from './mutation/MenuMutationRepository';

/**
 * Implémentation Supabase du repository de menu
 * Cette classe délègue les opérations aux repositories spécialisés
 */
export class MenuRepositoryImpl implements IMenuRepository {
  private cacheService: MenuCacheService;
  private allMenuItemsRepo: AllMenuItemsRepository;
  private categoryMenuItemsRepo: CategoryMenuItemsRepository;
  private moduleMenuItemsRepo: ModuleMenuItemsRepository;
  private parentMenuItemsRepo: ParentMenuItemsRepository;
  private menuMutationRepo: MenuMutationRepository;

  constructor() {
    this.cacheService = new MenuCacheService();
    this.allMenuItemsRepo = new AllMenuItemsRepository(this.cacheService);
    this.categoryMenuItemsRepo = new CategoryMenuItemsRepository(this.cacheService);
    this.moduleMenuItemsRepo = new ModuleMenuItemsRepository(this.cacheService);
    this.parentMenuItemsRepo = new ParentMenuItemsRepository(this.cacheService);
    this.menuMutationRepo = new MenuMutationRepository(this.cacheService);
  }

  /**
   * Récupère tous les éléments de menu
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.allMenuItemsRepo.getAllMenuItems();
  }

  /**
   * Récupère les éléments de menu par catégorie
   */
  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    return this.categoryMenuItemsRepo.getMenuItemsByCategory(category);
  }

  /**
   * Récupère les éléments de menu par module
   */
  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    return this.moduleMenuItemsRepo.getMenuItemsByModule(moduleCode, isAdmin);
  }
  
  /**
   * Récupère les éléments de menu par parent
   */
  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    return this.parentMenuItemsRepo.getMenuItemsByParent(parentId);
  }
  
  /**
   * Crée un nouvel élément de menu
   */
  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    return this.menuMutationRepo.createMenuItem(item);
  }
  
  /**
   * Met à jour un élément de menu existant
   */
  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    return this.menuMutationRepo.updateMenuItem(id, updates);
  }
  
  /**
   * Supprime un élément de menu
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    return this.menuMutationRepo.deleteMenuItem(id);
  }
}
