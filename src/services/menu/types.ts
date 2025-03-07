
/**
 * Types for menu items and related functionality
 */

// Catégories des éléments de menu
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
  requires_admin?: boolean; // Added missing property
  is_active?: boolean; // Added missing property
  children?: MenuItem[];
  position?: number; // Added to match DB schema
  description?: string; // Added to match DB schema
}

// Paramètres de création d'élément de menu
export type CreateMenuItemParams = Omit<MenuItem, 'id' | 'children'>;

// Paramètres de mise à jour d'élément de menu
export type UpdateMenuItemParams = Partial<Omit<MenuItem, 'id' | 'children'>>;
