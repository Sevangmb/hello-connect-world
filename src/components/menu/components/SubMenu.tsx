
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/services/menu/types";
import { MenuItemComponent } from "./MenuItem";
import { isActiveRoute } from "../utils/menuUtils";

interface SubMenuProps {
  item: MenuItem;
  children: MenuItem[];
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNavigate: (path: string, event: React.MouseEvent) => void;
  currentPath: string;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  item,
  children,
  isActive,
  isExpanded,
  onToggleExpand,
  onNavigate,
  currentPath
}) => {
  // Vérifier si des enfants existent
  const hasChildren = children && children.length > 0;
  
  // Trier les enfants par position ou ordre
  const sortedChildren = hasChildren 
    ? [...children].sort((a, b) => {
        if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position;
        }
        return (a.order || 999) - (b.order || 999);
      })
    : [];

  // Déterminer si au moins un enfant est actif selon le chemin actuel
  const isAnyChildActive = hasChildren && sortedChildren.some(child => {
    const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
    return isActiveRoute(childPath, currentPath);
  });

  // Le sous-menu est actif si lui-même ou l'un de ses enfants est actif
  const isSubMenuActive = isActive || isAnyChildActive;

  return (
    <div>
      <button
        onClick={onToggleExpand}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md",
          isSubMenuActive 
            ? "bg-primary text-primary-foreground" 
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        )}
      >
        <div className="flex items-center">
          {item.icon && (
            <span className="mr-2 h-4 w-4">
              {React.createElement(
                require("lucide-react")[item.icon] || (() => null),
                { className: "h-4 w-4" }
              )}
            </span>
          )}
          <span>{item.name}</span>
        </div>
        <span className="ml-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>
      
      {isExpanded && hasChildren && (
        <div className="ml-4 mt-1 space-y-1">
          {sortedChildren.map(child => {
            const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
            const isChildActive = isActiveRoute(childPath, currentPath);
            
            return (
              <MenuItemComponent
                key={child.id}
                item={child}
                isActive={isChildActive}
                onNavigate={onNavigate}
                hierarchical={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
