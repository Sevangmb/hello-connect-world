
/**
 * Types for menu items and related functionality
 */

// Catégories des éléments de menu - Principales catégories du système
export type MenuItemCategory = 
  // Menu principal
  | 'main' 
  | 'explore'
  | 'personal'
  | 'social'
  | 'profile'
  
  // Sous-catégories - Accueil
  | 'weather'
  | 'ai_suggestions'
  | 'feed'
  | 'challenges_banner'
  
  // Sous-catégories - Explorer
  | 'global_search'
  | 'trends'
  | 'popular_outfits'
  | 'popular_items'
  | 'popular_hashtags'
  | 'shops'
  | 'shop_map'
  | 'search'
  
  // Sous-catégories - Mon Univers (Perso)
  | 'wardrobe'     // Garde-robe
  | 'outfits'      // Mes Tenues
  | 'looks'        // Mes Looks
  | 'suitcases'    // Mes Valises
  | 'favorites'    // Mes Favoris
  | 'favorite_items' // Articles Favoris
  | 'favorite_outfits' // Tenues Favorites
  | 'favorite_users' // Utilisateurs Favoris
  | 'favorite_shops' // Boutiques Favorites
  | 'add_clothing' // Ajouter un Vêtement
  | 'scan_label'   // Scanner Étiquette
  | 'take_photo'   // Prendre une Photo
  | 'import_gallery' // Importer depuis Galerie
  | 'manual_entry' // Saisie Manuelle
  | 'create_outfit' // Créer une Tenue
  | 'publish_look' // Publier un Look
  
  // Sous-catégories - Communauté
  | 'messages'     // Messagerie
  | 'groups'       // Groupes
  | 'notifications' // Notifications
  | 'friends'      // Trouver des Amis
  
  // Sous-catégories - Profil
  | 'my_profile'   // Mon Profil
  | 'marketplace'  // Vide-Dressing
  | 'sell'         // Vendre
  | 'purchases'    // Achats
  | 'cart'         // Panier
  | 'settings'     // Paramètres
  | 'edit_profile' // Modifier le profil
  | 'privacy'      // Confidentialité
  | 'security'     // Sécurité
  | 'notification_settings' // Préférences de notifications
  | 'preferences'  // Préférences
  | 'data_storage' // Données et stockage
  | 'help'         // Aide & Support
  | 'logout'       // Déconnexion
  
  // Boutique (menu simplifié)
  | 'shop_dashboard'
  | 'shop_storefront'
  | 'shop_orders'
  | 'shop_messages'
  
  // Administration
  | 'admin'
  | 'admin_dashboard'
  | 'admin_users'
  | 'admin_users_manage'
  | 'admin_users_stats'
  | 'admin_shops'
  | 'admin_shops_manage'
  | 'admin_shops_stats'
  | 'admin_content'
  | 'admin_content_challenges'
  | 'admin_content_groups'
  | 'admin_content_moderation'
  | 'admin_marketing'
  | 'admin_marketing_campaigns'
  | 'admin_marketing_newsletters'
  | 'admin_stats'
  | 'admin_stats_general'
  | 'admin_stats_financial'
  | 'admin_settings'
  | 'admin_settings_admins'
  | 'admin_settings_roles'
  | 'admin_settings_config'
  | 'admin_marketplace'
  | 'admin_marketplace_items'
  | 'admin_marketplace_transactions'
  | 'admin_marketplace_stats'
  | 'admin_transactions'
  | 'admin_challenges'
  | 'admin_groups'
  | 'admin_moderation'
  | 'admin_campaigns'
  | 'admin_newsletters'
  | 'admin_general_stats'
  | 'admin_financial_stats'
  | 'admin_roles'
  | 'admin_config'
  
  // Utility categories
  | 'utility'
  | 'system'
  | 'legal'
  | string; // Permet les catégories basées sur les modules

// Élément de menu
export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  category: MenuItemCategory;
  parent_id?: string | null;
  order?: number;
  is_visible?: boolean;
  module_code?: string | null;
  requires_auth?: boolean;
  requires_admin?: boolean;
  is_active?: boolean;
  children?: MenuItem[];
  position?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Paramètres de création d'élément de menu
export type CreateMenuItemParams = Omit<MenuItem, 'id' | 'children'>;

// Paramètres de mise à jour d'élément de menu
export type UpdateMenuItemParams = Partial<Omit<MenuItem, 'id' | 'children'>>;

// Structure du menu par module
export interface ModuleMenuStructure {
  moduleCode: string;
  menuItems: MenuItem[];
}

// Configuration des menus par module
export interface MenuModuleConfig {
  moduleCode: string;
  categories: MenuItemCategory[];
  defaultVisible: boolean;
}

// Interface pour la structure d'un élément de menu hiérarchique
export interface HierarchicalMenuItem extends MenuItem {
  children: HierarchicalMenuItem[];
}

// Interface pour représenter un état de menu (comme un snapshot)
export interface MenuState {
  items: MenuItem[];
  timestamp: number;
  version: number;
}

// Structure des catégories de menu pour l'affichage
export interface MenuCategory {
  id: string;
  title: string;
  category: MenuItemCategory;
  icon?: string;
  order?: number;
  parent?: string;
}
