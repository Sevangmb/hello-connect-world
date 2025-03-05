
/**
 * Menu types
 */

export type MenuItemCategory = 'main' | 'admin' | 'system' | 'marketplace' | 'social' | 'utility';

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  description?: string;
  category: MenuItemCategory;
  module_code?: string;
  parent_id?: string;
  position: number;
  is_visible: boolean;
  is_active: boolean;
  requires_admin: boolean;
  created_at: string;
  updated_at: string;
}
