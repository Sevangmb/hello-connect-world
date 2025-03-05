
export interface MenuModule {
  id: string;
  code: string;
  name: string;
  status: string;
}

export type MenuCategory = 'admin' | 'user' | 'shop' | 'profile' | 'system';

export interface ModuleMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  module_code: string;
  category: MenuCategory;
  parent_id?: string | null;
  position: number;
  is_admin: boolean;
  is_protected: boolean;
  requires_auth: boolean;
  created_at: string;
  updated_at: string;
}
