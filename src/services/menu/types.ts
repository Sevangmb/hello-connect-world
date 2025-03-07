
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
  
  // Sous-catégories - Mon Univers (Perso)
  | 'wardrobe'     // Garde-robe
  | 'outfits'      // Mes Tenues
  | 'looks'        // Mes Looks
  | 'suitcases'    // Mes Valises
  | 'favorites'    // Mes Favoris
  | 'add_clothing' // Ajouter un Vêtement
  | 'create_outfit' // Créer une Tenue
  | 'publish_look' // Publier un Look
  
  // Sous-catégories - Explorer
  | 'search'       // Recherche
  | 'trends'       // Tendances
  | 'popular_outfits' // Tenues Populaires 
  | 'popular_items'   // Articles Populaires
  | 'popular_hashtags' // Hashtags Populaires
  | 'shops'        // Boutiques
  | 'shop_map'     // Carte des Boutiques
  
  // Sous-catégories - Marketplace
  | 'marketplace'  // Vide-Dressing
  | 'sell'         // Vendre
  | 'purchases'    // Achats
  | 'cart'         // Panier
  
  // Sous-catégories - Communauté
  | 'messages'     // Messagerie
  | 'groups'       // Groupes
  | 'notifications' // Notifications
  | 'friends'      // Trouver des Amis
  
  // Sous-catégories - Profil
  | 'my_profile'   // Mon Profil
  | 'settings'     // Paramètres
  | 'help'         // Aide & Support
  | 'logout'       // Déconnexion
  
  // Sous-catégories - Paramètres
  | 'edit_profile' // Modifier le profil
  | 'privacy'      // Confidentialité
  | 'security'     // Sécurité
  | 'notification_settings' // Préférences de notifications
  | 'preferences'  // Préférences
  | 'data_storage' // Données et stockage
  
  // Administration
  | 'admin'
  | 'admin_users'
  | 'admin_shops'
  | 'admin_content'
  | 'admin_marketing'
  | 'admin_stats'
  | 'admin_settings'
  | 'admin_marketplace'
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
  
  // Boutique (menu simplifié)
  | 'shop_dashboard'
  | 'shop_storefront'
  | 'shop_orders'
  | 'shop_messages'
  
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
}
