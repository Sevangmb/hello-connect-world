
import React, { useState, useEffect } from "react";
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
  const [processedItems, setProcessedItems] = useState<MenuItem[]>([]);
  
  // Organiser les éléments de menu au montage
  useEffect(() => {
    if (!menuItems || menuItems.length === 0) {
      console.log("HierarchicalMenu: No menu items provided");
      setProcessedItems([]);
      return;
    }

    console.log(`HierarchicalMenu: Processing ${menuItems.length} menu items`);
    
    // Filter out items with parent_id (they will be fetched in MenuItemWithChildren)
    const rootItems = menuItems.filter(item => !item.parent_id);
    console.log(`HierarchicalMenu: Found ${rootItems.length} root items`);
    
    const sortedItems = rootItems.sort((a, b) => {
      if (a.position !== undefined && b.position !== undefined) {
        return a.position - b.position;
      }
      return (a.order || 999) - (b.order || 999);
    });
    
    setProcessedItems(sortedItems);
    
    // Automatically expand items based on current path
    const newExpandedState: Record<string, boolean> = {};
    rootItems.forEach(item => {
      const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
      if (isActiveRoute(normalizedPath, currentPath)) {
        newExpandedState[item.id] = true;
      }
    });
    
    setExpandedItems(prev => ({...prev, ...newExpandedState}));
  }, [menuItems, currentPath]);
  
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
      {processedItems.length > 0 ? (
        processedItems.map((item) => {
          const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
          const isItemActive = isActiveRoute(normalizedPath, currentPath);
          const isExpanded = expandedItems[item.id] || isItemActive;
          
          return (
            <MenuItemWithChildren
              key={item.id}
              item={item}
              isActive={isItemActive}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleItemExpansion(item.id)}
              onNavigate={onNavigate}
              currentPath={currentPath}
              level={0}
            />
          );
        })
      ) : (
        <div className="text-gray-500 text-sm py-2">
          Aucun élément de menu disponible
        </div>
      )}
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
  level: number;
}

const MenuItemWithChildren: React.FC<MenuItemWithChildrenProps> = ({
  item,
  isActive,
  isExpanded,
  onToggleExpand,
  onNavigate,
  currentPath,
  level
}) => {
  const { data: childItems = [], isLoading, error } = useMenuItemsByParent(item.id);
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  
  useEffect(() => {
    if (!isLoading) {
      // Vérifier si des enfants existent
      const childrenExist = childItems && childItems.length > 0;
      console.log(`MenuItemWithChildren: Item ${item.name} has ${childItems?.length || 0} children`);
      setHasChildren(childrenExist);
    }
  }, [childItems, isLoading, item.name]);
  
  if (isLoading && level === 0) {
    return <div className="py-2 px-4 text-sm text-gray-400">Chargement...</div>;
  }
  
  if (error) {
    console.error("Error loading child items:", error);
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
      key={item.id}
      item={item}
      isActive={isActive}
      onNavigate={onNavigate}
      hierarchical={false}
    />
  );
};
