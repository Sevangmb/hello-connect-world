
/**
 * Types pour le module de gestion des menus
 */

// Catégories de menu
export type MenuItemCategory = 'main' | 'admin' | 'system' | 'marketplace' | 'social' | 'utility';

// Type pour un élément de menu
export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon: string | null;
  module_code: string | null;
  category: MenuItemCategory;
  position: number;
  parent_id: string | null;
  description: string | null;
  is_active: boolean;
  is_visible: boolean;
  requires_admin: boolean;
  created_at: string;
  updated_at: string;
  children?: MenuItem[]; // Pour les menus hiérarchiques
}

// Type pour les options de filtre de menu
export interface MenuFilterOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  isActive?: boolean;
  isVisible?: boolean;
  requiresAdmin?: boolean;
}
