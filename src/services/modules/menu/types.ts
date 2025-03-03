
/**
 * Types pour le module Menu
 */

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  parentId?: string | null;
  moduleCode: string;
  position: number;
  isVisible: boolean;
  requiresAuth: boolean;
  roles?: string[];
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
