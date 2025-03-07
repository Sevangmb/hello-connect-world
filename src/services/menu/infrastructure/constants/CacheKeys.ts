
/**
 * Clés de cache pour les services de menu
 */
export class MenuCacheKeys {
  /**
   * Clé pour tous les éléments de menu
   */
  static readonly ALL_ITEMS_KEY = 'all_items';
  
  /**
   * Obtient la clé pour les éléments par catégorie
   */
  static getCategoryKey(category: string): string {
    return `category_${category}`;
  }
  
  /**
   * Obtient la clé pour les éléments par module
   */
  static getModuleKey(moduleCode: string, isAdmin: boolean = false): string {
    return `module_${moduleCode}_${isAdmin ? 'admin' : 'user'}`;
  }
  
  /**
   * Obtient la clé pour les éléments par parent
   */
  static getParentKey(parentId: string | null): string {
    return `parent_${parentId || 'null'}`;
  }
}
