
/**
 * Types for menu items and related functionality
 */

// Catégories des éléments de menu - Assurons-nous que toutes les catégories sont définies
export type MenuItemCategory = 
  | 'main' 
  | 'admin' 
  | 'user' 
  | 'shop' 
  | 'profile' 
  | 'settings'
  | 'legal'
  | 'system'
  | 'marketplace'
  | 'social'
  | 'utility'
  | 'wardrobe'
  | 'community'
  | 'personal'
  | 'explore'
  | 'suitcases'
  | 'challenges'
  | 'notifications'
  | 'messages'
  | 'friends'
  | 'outfits'
  | 'cart'
  | 'search'
  | string; // Allow string to support module-based categories

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
