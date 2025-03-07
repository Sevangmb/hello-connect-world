
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/services/menu/types";
import { MenuItemComponent } from "./MenuItem";
import { ChevronDown, ChevronRight } from "lucide-react";
import { isActiveRoute } from "../utils/menuUtils";

interface SubMenuProps {
  item: MenuItem;
  children: MenuItem[];
  isActive: boolean;
  onNavigate: (path: string, event: React.MouseEvent) => void;
  currentPath: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  item,
  children,
  isActive,
  onNavigate,
  currentPath,
  isExpanded = false,
  onToggleExpand
}) => {
  // Vérifier si un sous-élément est actif
  const hasActiveChild = children.some(child => {
    const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
    return isActiveRoute(childPath, currentPath);
  });
  
  // Si un enfant est actif, considérer le parent comme actif
  const isParentActive = isActive || hasActiveChild;
  
  // Utiliser l'état d'expansion (défini par le parent ou automatiquement basé sur l'activité)
  const shouldExpand = isExpanded || isParentActive;
  
  // Obtenir le chemin normalisé
  const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "justify-between font-medium w-full py-2 px-3 rounded-md",
          isParentActive 
            ? "bg-primary/10 text-primary hover:bg-primary/15" 
            : "text-gray-700 hover:text-primary hover:bg-primary/5"
        )}
        onClick={(e) => {
          // Si onToggleExpand est fourni, l'utiliser pour basculer l'expansion
          if (onToggleExpand) {
            e.preventDefault();
            onToggleExpand();
          } else {
            // Sinon, naviguer vers la page
            onNavigate(normalizedPath, e);
          }
        }}
      >
        <span className="flex items-center text-sm">
          {item.icon && (
            <span className="mr-2 text-inherit">
              {/* Render icon component here if needed */}
            </span>
          )}
          <span className="truncate">{item.name}</span>
        </span>
        {children.length > 0 && (
          shouldExpand 
            ? <ChevronDown className="h-4 w-4 flex-shrink-0 text-inherit" /> 
            : <ChevronRight className="h-4 w-4 flex-shrink-0 text-inherit" />
        )}
      </Button>
      
      {shouldExpand && children.length > 0 && (
        <div className="ml-4 pl-2 border-l border-gray-200 space-y-1">
          {children.map(child => {
            const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
            const isChildActive = isActiveRoute(childPath, currentPath);
            const hasGrandchildren = child.children && child.children.length > 0;
            
            if (hasGrandchildren) {
              return (
                <SubMenu
                  key={child.id}
                  item={child}
                  children={child.children || []}
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
                hierarchical={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
