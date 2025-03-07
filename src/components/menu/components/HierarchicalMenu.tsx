
import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/services/menu/types";
import { MenuItemComponent } from "./MenuItem";
import { SubMenu } from "./SubMenu";
import { isActiveRoute } from "../utils/menuUtils";
import { useMenuItemsByParent } from "@/hooks/menu/useMenuItems"; 

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
  
  // Mémoriser les éléments de menu et la structure hiérarchique
  const { rootItems, itemsWithChildren } = useMemo(() => {
    if (!menuItems || menuItems.length === 0) {
      console.log("HierarchicalMenu: No menu items provided");
      return { rootItems: [], itemsWithChildren: new Set() };
    }

    console.log(`HierarchicalMenu: Processing ${menuItems.length} menu items`);
    
    // Identifier les éléments racine (sans parent_id)
    const rootItems = menuItems.filter(item => !item.parent_id);
    console.log(`HierarchicalMenu: Found ${rootItems.length} root items`);
    
    // Identifier les éléments qui ont des enfants
    const parentIds = new Set(
      menuItems
        .filter(item => item.parent_id)
        .map(item => item.parent_id)
    );
    
    // Trier les éléments racine
    const sortedRootItems = rootItems.sort((a, b) => {
      if (a.position !== undefined && b.position !== undefined) {
        return a.position - b.position;
      }
      return (a.order || 999) - (b.order || 999);
    });
    
    return { 
      rootItems: sortedRootItems,
      itemsWithChildren: parentIds
    };
  }, [menuItems]);
  
  // Initialiser les états d'expansion lors du chargement ou changement de chemin
  useEffect(() => {
    // Trouver les éléments qui devraient être ouverts en fonction du chemin actuel
    const newExpandedState: Record<string, boolean> = {};
    
    rootItems.forEach(item => {
      const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
      if (isActiveRoute(normalizedPath, currentPath) || currentPath === '/') {
        newExpandedState[item.id] = true;
      }
    });
    
    setExpandedItems(prev => ({...prev, ...newExpandedState}));
  }, [rootItems, currentPath]);
  
  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-2">
        Aucun élément hiérarchique disponible
      </div>
    );
  }

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {rootItems.map((item) => {
        const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
        const isItemActive = isActiveRoute(normalizedPath, currentPath);
        const isExpanded = expandedItems[item.id] || isItemActive;
        const hasChildren = itemsWithChildren.has(item.id);
        
        return (
          <MenuItemWithChildren
            key={item.id}
            item={item}
            isActive={isItemActive}
            isExpanded={isExpanded}
            onToggleExpand={() => toggleItemExpansion(item.id)}
            onNavigate={onNavigate}
            currentPath={currentPath}
            hasKnownChildren={hasChildren}
          />
        );
      })}
    </nav>
  );
};

interface MenuItemWithChildrenProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNavigate: (path: string, event: React.MouseEvent) => void;
  currentPath: string;
  hasKnownChildren?: boolean;
}

const MenuItemWithChildren: React.FC<MenuItemWithChildrenProps> = ({
  item,
  isActive,
  isExpanded,
  onToggleExpand,
  onNavigate,
  currentPath,
  hasKnownChildren = false
}) => {
  const { data: childItems = [], isLoading } = useMenuItemsByParent(item.id);
  const [childrenExist, setChildrenExist] = useState<boolean>(hasKnownChildren);
  
  useEffect(() => {
    if (!isLoading) {
      const hasChildren = childItems && childItems.length > 0;
      console.log(`MenuItemWithChildren: Item ${item.name} has ${childItems?.length || 0} children`);
      setChildrenExist(hasChildren);
    }
  }, [childItems, isLoading, item.name]);
  
  // Si on sait que cet élément a des enfants ou si on a chargé des enfants
  const hasChildren = hasKnownChildren || childrenExist;
  
  if (isLoading && !childItems.length) {
    return (
      <div className="py-2 px-3 text-sm text-gray-400 animate-pulse">
        Chargement de {item.name}...
      </div>
    );
  }
  
  if (hasChildren) {
    return (
      <SubMenu
        item={item}
        children={childItems}
        isActive={isActive}
        onNavigate={onNavigate}
        currentPath={currentPath}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
    );
  }
  
  return (
    <MenuItemComponent
      item={item}
      isActive={isActive}
      onNavigate={onNavigate}
      hierarchical={false}
    />
  );
};
