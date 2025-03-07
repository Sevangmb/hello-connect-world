
import React, { useState, useEffect } from "react";
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
  const [subExpandedItems, setSubExpandedItems] = useState<Record<string, boolean>>({});
  const [processedChildren, setProcessedChildren] = useState<MenuItem[]>([]);
  
  // Check if any child is active
  useEffect(() => {
    const hasActiveChild = children.some(child => {
      const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
      const isChildActive = isActiveRoute(childPath, currentPath);
      
      // Auto-expand parent if child is active
      if (isChildActive && onToggleExpand && !isExpanded) {
        onToggleExpand();
      }
      
      return isChildActive;
    });
    
    // Sort children by position or order
    const sortedChildren = [...children].sort((a, b) => {
      if (a.position !== undefined && b.position !== undefined) {
        return a.position - b.position;
      }
      return (a.order || 999) - (b.order || 999);
    });
    
    setProcessedChildren(sortedChildren);
    
    // Auto-expand children that are active
    const newExpandedState: Record<string, boolean> = {};
    children.forEach(child => {
      const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
      if (isActiveRoute(childPath, currentPath)) {
        newExpandedState[child.id] = true;
      }
    });
    
    setSubExpandedItems(prev => ({...prev, ...newExpandedState}));
  }, [children, currentPath, isExpanded, onToggleExpand]);
  
  // If parent has active child, consider it active
  const isParentActive = isActive || processedChildren.some(child => {
    const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
    return isActiveRoute(childPath, currentPath);
  });
  
  // Use the expansion state
  const shouldExpand = isExpanded || isParentActive;
  
  // Normalize path
  const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
  
  // Toggle function for sub-items
  const toggleSubItemExpansion = (itemId: string) => {
    setSubExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
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
          // Toggle expansion if children exist
          if (onToggleExpand && processedChildren.length > 0) {
            e.preventDefault();
            onToggleExpand();
          } else {
            // Navigate to the page if no children or no toggle handler
            onNavigate(normalizedPath, e);
          }
        }}
      >
        <span className="flex items-center text-sm">
          {item.icon && (
            <span className="mr-2 text-inherit">
              {/* Icon would be rendered here */}
            </span>
          )}
          <span className="truncate">{item.name}</span>
        </span>
        {processedChildren.length > 0 && (
          shouldExpand 
            ? <ChevronDown className="h-4 w-4 flex-shrink-0 text-inherit" /> 
            : <ChevronRight className="h-4 w-4 flex-shrink-0 text-inherit" />
        )}
      </Button>
      
      {shouldExpand && processedChildren.length > 0 && (
        <div className="ml-4 pl-2 border-l border-gray-200 space-y-1">
          {processedChildren.map(child => {
            const childPath = child.path.startsWith('/') ? child.path : `/${child.path}`;
            const isChildActive = isActiveRoute(childPath, currentPath);
            const isChildExpanded = subExpandedItems[child.id] || isChildActive;
            
            // Check if this child has its own children
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
                  isExpanded={isChildExpanded}
                  onToggleExpand={() => toggleSubItemExpansion(child.id)}
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
