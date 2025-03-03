
/**
 * Types pour le module Menu
 */

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string | null;
  module_code: string | null;
  category: 'main' | 'admin' | 'system' | 'marketplace' | 'social' | 'utility';
  position: number;
  parent_id: string | null;
  description: string | null;
  is_active: boolean;
  is_visible: boolean;
  requires_admin: boolean;
  created_at: string;
  updated_at: string;
  children?: MenuItem[];
}

export interface MenuSection {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuConfiguration {
  sections: MenuSection[];
  defaultActiveItem?: string;
}

