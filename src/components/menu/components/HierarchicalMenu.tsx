
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/services/menu/types";
import { MenuItemComponent } from "./MenuItem";
import { SubMenu } from "./SubMenu";
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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // Organiser les éléments en une hiérarchie
  const buildHierarchy = (items: MenuItem[]): MenuItem[] => {
    const rootItems: MenuItem[] = [];
    const itemMap = new Map<string, MenuItem>();
    
    // Première passe: ajouter tous les éléments à la map
    items.forEach(item => {
      // Créer une copie pour éviter les mutations
      const itemCopy = { ...item, children: [] };
      itemMap.set(item.id, itemCopy);
    });
    
    // Deuxième passe: construire la hiérarchie
    items.forEach(item => {
      const itemWithChildren = itemMap.get(item.id);
      if (!itemWithChildren) return;
      
      if (item.parent_id && itemMap.has(item.parent_id)) {
        // C'est un enfant, l'ajouter au parent
        const parent = itemMap.get(item.parent_id);
        if (parent && !parent.children) {
          parent.children = [];
        }
        if (parent) {
          parent.children!.push(itemWithChildren);
        }
      } else {
        // C'est un élément racine
        rootItems.push(itemWithChildren);
      }
    });
    
    // Trier les éléments par ordre (si disponible)
    return rootItems.sort((a, b) => (a.order || 999) - (b.order || 999));
  };
  
  // Fonction pour basculer l'état d'expansion d'un élément
  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  const hierarchicalItems = buildHierarchy(menuItems);

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {hierarchicalItems.map((item) => {
        const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
        const isItemActive = isActiveRoute(normalizedPath, currentPath);
        const hasChildren = item.children && item.children.length > 0;
        
        // Si l'élément a des enfants, utiliser le composant SubMenu
        if (hasChildren) {
          const isExpanded = expandedItems[item.id] || isItemActive;
          
          return (
            <SubMenu
              key={item.id}
              item={item}
              children={item.children}
              isActive={isItemActive}
              onNavigate={onNavigate}
              currentPath={currentPath}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleItemExpansion(item.id)}
            />
          );
        }
        
        // Sinon, utiliser le composant MenuItem standard
        return (
          <MenuItemComponent
            key={item.id}
            item={item}
            isActive={isItemActive}
            onNavigate={onNavigate}
            hierarchical={false}
          />
        );
      })}
    </nav>
  );
};
