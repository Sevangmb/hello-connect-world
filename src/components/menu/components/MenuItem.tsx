
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuItem as MenuItemType } from "@/services/menu/types";
import { ChevronRight } from "lucide-react";
import { getIcon, isActiveRoute } from "../utils/menuUtils";

interface MenuItemProps {
  item: MenuItemType;
  isActive: boolean;
  onNavigate: (path: string, event: React.MouseEvent) => void;
  hierarchical?: boolean;
}

export const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  isActive,
  onNavigate,
  hierarchical = false
}) => {
  // Normaliser le chemin pour la comparaison
  const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
  
  // Pour les éléments avec des enfants en mode hiérarchique
  if (hierarchical && item.children && item.children.length > 0) {
    return (
      <div className="space-y-1">
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "justify-between font-medium w-full py-2",
            isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5"
          )}
          onClick={(e) => onNavigate(normalizedPath, e)}
        >
          <span className="flex items-center">
            {getIcon(item.icon)}
            <span>{item.name}</span>
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="pl-4 border-l-2 border-gray-200 ml-3 space-y-1">
          {item.children.map(child => {
            const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
            const isChildActive = isActiveRoute(childPath, window.location.pathname);
            
            return (
              <Button
                key={child.id}
                variant={isChildActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "justify-start font-normal w-full py-1.5 text-sm",
                  isChildActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5"
                )}
                onClick={(e) => onNavigate(childPath, e)}
              >
                {getIcon(child.icon)}
                <span>{child.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Pour les éléments simples sans enfants
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "justify-start font-medium w-full py-2",
        isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5"
      )}
      onClick={(e) => onNavigate(normalizedPath, e)}
    >
      {getIcon(item.icon)}
      <span>{item.name}</span>
    </Button>
  );
};
