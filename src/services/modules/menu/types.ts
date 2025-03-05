
// Menu types for module menu service
export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  module_code: string | null;
  category: 'main' | 'admin' | 'social' | 'marketplace' | 'utility' | 'system';
  position: number;
  parent_id: string | null;
  is_active: boolean;
  is_visible: boolean;
  requires_admin: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type MenuItemCategory = 'main' | 'admin' | 'social' | 'marketplace' | 'utility' | 'system';

export interface MenuCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  position: number;
  created_at: string;
  updated_at: string;
}
