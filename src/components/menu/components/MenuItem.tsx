
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuItem as MenuItemType } from "@/services/menu/types";
import { ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getIcon } from "../utils/menuUtils";

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
  
  // Obtenir l'icône si elle existe
  const renderIcon = () => {
    if (!item.icon) return null;
    
    const IconComponent = getIcon(item.icon);
    return IconComponent ? <IconComponent className="h-4 w-4 mr-2" /> : null;
  };
  
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
            {renderIcon()}
            <span className="truncate">{item.name}</span>
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="pl-4 border-l-2 border-gray-200 ml-3 space-y-1">
          {item.children.map(child => {
            const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
            
            return (
              <MenuItemComponent
                key={child.id}
                item={child}
                isActive={false} // Calculé dans le composant parent
                onNavigate={onNavigate}
                hierarchical={false}
              />
            );
          })}
        </div>
      </div>
    );
  }
  
  // Pour les éléments simples sans enfants ou non hiérarchiques
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "justify-start font-medium w-full py-2",
              isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5"
            )}
            onClick={(e) => onNavigate(normalizedPath, e)}
          >
            {renderIcon()}
            <span className="truncate">{item.name}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.description || item.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
