
import React from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/services/menu/types";
import { MenuItemComponent } from "./MenuItem";
import { isActiveRoute } from "../utils/menuUtils";

interface HierarchicalMenuProps {
  menuItems: MenuItem[];
  className?: string;
  onNavigate: (path: string, event: React.MouseEvent) => void;
  currentPath: string;
}

export const HierarchicalMenu: React.FC<HierarchicalMenuProps> = ({
  menuItems,
  className,
  onNavigate,
  currentPath
}) => {
  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {menuItems.map((item) => {
        const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
        const isItemActive = isActiveRoute(normalizedPath, currentPath);
        
        return (
          <MenuItemComponent
            key={item.id}
            item={item}
            isActive={isItemActive}
            onNavigate={onNavigate}
            hierarchical={true}
          />
        );
      })}
    </nav>
  );
};
