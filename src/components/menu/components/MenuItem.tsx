
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuItem as MenuItemType } from "@/services/menu/types";
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
    if (IconComponent) {
      return React.createElement(IconComponent as React.ComponentType<any>, { 
        className: "h-4 w-4 mr-2 flex-shrink-0" 
      });
    }
    return null;
  };
  
  // Style de base pour tous les boutons de menu
  const baseButtonClasses = "justify-start text-sm font-medium w-full py-2 rounded-md transition-colors";
  
  // Classes additionnelles basées sur l'état actif et le mode hiérarchique
  const additionalClasses = isActive
    ? "bg-primary/10 text-primary hover:bg-primary/15"
    : "text-gray-700 hover:text-primary hover:bg-primary/5";
  
  // Classes spécifiques au mode hiérarchique
  const hierarchicalClasses = hierarchical
    ? "px-2"
    : "px-3";
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(baseButtonClasses, additionalClasses, hierarchicalClasses)}
            onClick={(e) => onNavigate(normalizedPath, e)}
          >
            {renderIcon()}
            <span className="truncate">{item.name}</span>
          </Button>
        </TooltipTrigger>
        {item.description && (
          <TooltipContent side="right" align="center" className="max-w-xs">
            <p className="text-sm">{item.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
