
/**
 * Constantes pour les clés de cache du menu
 */
export class MenuCacheKeys {
  public static readonly ALL_ITEMS_KEY = 'all';
  public static readonly CATEGORY_PREFIX = 'category_';
  public static readonly MODULE_PREFIX = 'module_';
  public static readonly PARENT_PREFIX = 'parent_';
  
  /**
   * Génère une clé de cache pour une catégorie
   */
  public static getCategoryKey(category: string): string {
    return `${this.CATEGORY_PREFIX}${category}`;
  }
  
  /**
   * Génère une clé de cache pour un module
   */
  public static getModuleKey(moduleCode: string, isAdmin: boolean): string {
    return `${this.MODULE_PREFIX}${moduleCode}_${isAdmin ? 'admin' : 'user'}`;
  }
  
  /**
   * Génère une clé de cache pour un parent
   */
  public static getParentKey(parentId: string | null): string {
    return `${this.PARENT_PREFIX}${parentId || 'root'}`;
  }
}
