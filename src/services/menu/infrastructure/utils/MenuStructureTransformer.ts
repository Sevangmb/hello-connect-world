
import { MenuItemCategory } from '../../types';

/**
 * Classe utilitaire pour transformer la structure du menu
 */
export class MenuStructureTransformer {
  /**
   * Obtenir les sous-catégories pour une section principale
   */
  static getSubcategoriesForSection(category: string): MenuItemCategory[] {
    const subcategories: Record<string, MenuItemCategory[]> = {
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
    
    return subcategories[category] || [];
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
   * Vérifier si une catégorie a des enfants
   */
  static hasChildren(category: string): boolean {
    return this.getSubcategoriesForSection(category).length > 0;
  }
  
  /**
   * Conversion de chemin de menu en chemin de route
   */
  static getRoutePathForMenuItem(menuCategory: string): string {
    const routeMapping: Record<string, string> = {
      // Routes principales
      main: '/',
      explore: '/explore',
      personal: '/personal',
      social: '/social/challenges',
      profile: '/profile',
      
      // Sous-routes
      wardrobe: '/personal',
      outfits: '/wardrobe/outfits',
      looks: '/looks',
      suitcases: '/wardrobe/suitcases',
      marketplace: '/marketplace',
      
      // Sous-routes admin
      admin: '/admin/dashboard',
      admin_users: '/admin/users',
      admin_dashboard: '/admin/dashboard',
      admin_shops: '/admin/shops',
      admin_content: '/admin/content',
      admin_stats: '/admin/stats',
      admin_settings: '/admin/settings',
      
      // Autres routes
      messages: '/social/messages',
      groups: '/social/groups',
      friends: '/social/friends',
      notifications: '/notifications',
      settings: '/profile/settings',
      weather: '/weather',
      ai_suggestions: '/suggestions',
      shop_map: '/boutiques'
    };
    
    return routeMapping[menuCategory] || `/${menuCategory}`;
  }
}
