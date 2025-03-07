
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/services/menu/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MenuItemComponent } from "./MenuItem";
import { isActiveRoute } from "../utils/menuUtils";

interface SubMenuProps {
  item: MenuItem;
  children: MenuItem[];
  isActive: boolean;
  onNavigate: (path: string, event: React.MouseEvent) => void;
  currentPath: string;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  item,
  children,
  isActive,
  onNavigate,
  currentPath
}) => {
  const [isOpen, setIsOpen] = useState(isActive);
  
  // Déterminer si au moins un enfant est actif
  const hasActiveChild = children.some(child => {
    const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
    return isActiveRoute(childPath, currentPath);
  });
  
  // Ouvrir automatiquement si un enfant est actif
  React.useEffect(() => {
    if (hasActiveChild && !isOpen) {
      setIsOpen(true);
    }
  }, [hasActiveChild, isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;

  return (
    <div className="w-full space-y-1">
      <Button
        variant={isActive || hasActiveChild ? "secondary" : "ghost"}
        size="sm"
        className={cn(
          "justify-between font-medium w-full py-2",
          (isActive || hasActiveChild) ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5"
        )}
        onClick={(e) => {
          if (normalizedPath && normalizedPath !== '#') {
            onNavigate(normalizedPath, e);
          } else {
            handleToggle(e);
          }
        }}
      >
        <span className="flex items-center truncate">
          {item.icon && (
            <span className="mr-2">
              {React.createElement(
                // @ts-ignore - Les icônes sont dynamiques
                require("lucide-react")[item.icon] || (() => null),
                { className: "h-4 w-4" }
              )}
            </span>
          )}
          <span className="truncate">{item.name}</span>
        </span>
        <button onClick={handleToggle} className="p-1">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </Button>
      
      {isOpen && (
        <div className="pl-4 ml-2 border-l-2 border-gray-200 space-y-1">
          {children.map(child => {
            const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
            const isChildActive = isActiveRoute(childPath, currentPath);
            
            // Vérifier si l'enfant a lui-même des enfants
            if (child.children && child.children.length > 0) {
              return (
                <SubMenu
                  key={child.id}
                  item={child}
                  children={child.children}
                  isActive={isChildActive}
                  onNavigate={onNavigate}
                  currentPath={currentPath}
                />
              );
            }
            
            return (
              <MenuItemComponent
                key={child.id}
                item={child}
                isActive={isChildActive}
                onNavigate={onNavigate}
                hierarchical={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
