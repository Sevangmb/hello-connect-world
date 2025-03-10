
import React from 'react';
import { MenuSection } from './MenuSection';
import { cn } from "@/lib/utils";
import { MenuSection as MenuSectionType } from '@/hooks/menu/useMainMenuItems';

interface VerticalMenuProps {
  items: MenuSectionType[];
  onItemClick: (path: string) => void;
  className?: string;
}

/**
 * Vertical menu component with sections and expandable items
 */
export const VerticalMenu: React.FC<VerticalMenuProps> = ({ 
  items, 
  onItemClick,
  className
}) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => (
        <MenuSection
          key={item.id}
          item={item}
          handleNavigate={onItemClick}
        />
      ))}
    </div>
  );
};

export default VerticalMenu;
