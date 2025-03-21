
export type MenuItemCategory = 'main' | 'admin' | 'system' | 'marketplace' | 'social' | 'utility';

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  description?: string;
  parent_id?: string | null;
  position: number;
  category: MenuItemCategory;
  module_code?: string | null;
  is_active: boolean;
  is_visible: boolean;
  requires_admin: boolean;
  created_at: string;
  updated_at: string;
}

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
