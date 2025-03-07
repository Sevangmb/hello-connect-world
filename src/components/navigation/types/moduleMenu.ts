
import { MenuItemCategory } from "@/services/menu/types";

export interface CategoryGroupProps {
  title: string;
  category: MenuItemCategory;
  icon?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  category: MenuItemCategory;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}
