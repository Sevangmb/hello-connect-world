
import { MenuItemCategory } from '../../types';

/**
 * Classe utilitaire pour transformer la structure du menu
 */
export class MenuStructureTransformer {
  // Mapping des sections et leurs sous-catégories
  private static readonly subcategoryMap: Record<string, MenuItemCategory[]> = {
    // Menu principal
    main: ['weather', 'ai_suggestions', 'feed', 'challenges_banner'],
    explore: ['global_search', 'trends', 'popular_outfits', 'popular_items', 'popular_hashtags', 'shops', 'shop_map'],
    personal: ['wardrobe', 'outfits', 'looks', 'suitcases', 'favorites', 'add_clothing', 'create_outfit', 'publish_look'],
    social: ['messages', 'groups', 'notifications', 'friends'],
    profile: ['my_profile', 'marketplace', 'settings', 'help', 'logout'],
    
    // Sous-catégories imbriquées
    favorites: ['favorite_items', 'favorite_outfits', 'favorite_users', 'favorite_shops'],
    add_clothing: ['scan_label', 'take_photo', 'import_gallery', 'manual_entry'],
    marketplace: ['sell', 'purchases'],
    settings: ['edit_profile', 'privacy', 'security', 'notification_settings', 'preferences', 'data_storage'],
    
    // Catégories Admin
    admin: ['admin_dashboard', 'admin_users', 'admin_shops', 'admin_content', 'admin_marketplace', 'admin_marketing', 'admin_stats', 'admin_settings'],
    admin_users: ['admin_users_manage', 'admin_users_stats'],
    admin_shops: ['admin_shops_manage', 'admin_shops_stats'],
    admin_content: ['admin_content_challenges', 'admin_content_groups', 'admin_content_moderation'],
    admin_marketing: ['admin_marketing_campaigns', 'admin_marketing_newsletters'],
    admin_stats: ['admin_stats_general', 'admin_stats_financial'],
    admin_settings: ['admin_settings_admins', 'admin_settings_roles', 'admin_settings_config'],
    admin_marketplace: ['admin_marketplace_items', 'admin_marketplace_transactions', 'admin_marketplace_stats']
  };

  // Mapping direct des routes
  private static readonly routeMap: Record<string, string> = {
    // Routes principales
    main: '/',
    explore: '/explore',
    personal: '/personal',
    social: '/social/challenges',
    profile: '/profile',
    
    // Routes de la section Personal
    wardrobe: '/personal/wardrobe',
    outfits: '/personal/outfits',
    looks: '/personal/looks',
    suitcases: '/personal/suitcases',
    favorites: '/personal/favorites',
    
    // Routes de la section Social
    messages: '/social/messages',
    groups: '/social/groups',
    friends: '/social/friends',
    notifications: '/notifications',
    
    // Routes de la section Profile
    settings: '/profile/settings',
    marketplace: '/marketplace',
    
    // Routes diverses
    weather: '/weather',
    ai_suggestions: '/suggestions',
    shop_map: '/boutiques',
    
    // Routes Admin
    admin: '/admin/dashboard',
    admin_dashboard: '/admin/dashboard',
    admin_users: '/admin/users',
    admin_users_manage: '/admin/users/manage',
    admin_users_stats: '/admin/users/stats',
    admin_shops: '/admin/shops',
    admin_shops_manage: '/admin/shops/manage',
    admin_shops_stats: '/admin/shops/stats',
    admin_content: '/admin/content',
    admin_content_challenges: '/admin/content/challenges',
    admin_content_groups: '/admin/content/groups',
    admin_content_moderation: '/admin/content/moderation',
    admin_marketplace: '/admin/marketplace',
    admin_marketplace_items: '/admin/marketplace/items',
    admin_marketplace_transactions: '/admin/marketplace/transactions',
    admin_marketplace_stats: '/admin/marketplace/stats',
    admin_marketing: '/admin/marketing',
    admin_marketing_campaigns: '/admin/marketing/campaigns',
    admin_marketing_newsletters: '/admin/marketing/newsletters',
    admin_stats: '/admin/stats',
    admin_stats_general: '/admin/stats/general',
    admin_stats_financial: '/admin/stats/financial',
    admin_settings: '/admin/settings',
    admin_settings_admins: '/admin/settings/admins',
    admin_settings_roles: '/admin/settings/roles',
    admin_settings_config: '/admin/settings/config'
  };
  
  /**
   * Obtenir les sous-catégories pour une section principale
   */
  static getSubcategoriesForSection(category: string): MenuItemCategory[] {
    return this.subcategoryMap[category] || [];
  }
  
  /**
   * Obtenir les sous-catégories de niveau 2 pour une catégorie
   */
  static getLevel2Subcategories(category: string): MenuItemCategory[] {
    const subcategories = this.getSubcategoriesForSection(category);
    const allLevel2: MenuItemCategory[] = [];
    
    subcategories.forEach(subcat => {
      const subSubcategories = this.getSubcategoriesForSection(subcat as string);
      allLevel2.push(...subSubcategories);
    });
    
    return allLevel2;
  }
  
  /**
   * Récupérer toutes les sous-catégories administratives
   */
  static getAllAdminSubcategories(): MenuItemCategory[] {
    const adminSubcats = this.getSubcategoriesForSection('admin');
    const allAdminCategories: MenuItemCategory[] = [...adminSubcats];
    
    adminSubcats.forEach(subcat => {
      const subSubcategories = this.getSubcategoriesForSection(subcat as string);
      allAdminCategories.push(...subSubcategories);
    });
    
    return allAdminCategories;
  }
  
  /**
   * Vérifier si une catégorie a des enfants
   */
  static hasChildren(category: string): boolean {
    return this.getSubcategoriesForSection(category).length > 0;
  }
  
  /**
   * Conversion de chemin de menu en chemin de route
   */
  static getRoutePathForMenuItem(menuCategory: string): string {
    return this.routeMap[menuCategory] || `/${menuCategory}`;
  }
  
  /**
   * Associer un module à une catégorie
   */
  static getModuleForCategory(category: string): string | null {
    const moduleMap: Record<string, string> = {
      // Catégories principales
      weather: 'weather',
      ai_suggestions: 'ai',
      
      // Personal
      wardrobe: 'wardrobe',
      outfits: 'wardrobe',
      looks: 'social',
      suitcases: 'wardrobe',
      
      // Social
      messages: 'messages',
      groups: 'social',
      friends: 'social',
      
      // Shop
      shops: 'shop',
      shop_map: 'shop',
      marketplace: 'marketplace',
      
      // Admin
      admin: 'admin'
    };
    
    // Pour les catégories admin, automatiquement attribuer au module admin
    if (category.startsWith('admin_')) {
      return 'admin';
    }
    
    return moduleMap[category] || null;
  }
}
