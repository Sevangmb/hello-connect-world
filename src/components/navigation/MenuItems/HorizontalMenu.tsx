
import React from 'react';
import { MenuItem } from './MenuItem';
import { cn } from "@/lib/utils";
import { MenuSection as MenuSectionType } from '@/hooks/menu/useMainMenuItems';

interface HorizontalMenuProps {
  items: MenuSectionType[];
  onItemClick: (path: string) => void;
  className?: string;
}

/**
 * Horizontal menu component variant
 */
export const HorizontalMenu: React.FC<HorizontalMenuProps> = ({ 
  items, 
  onItemClick,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {items.map((item) => (
        <MenuItem
          key={item.id}
          label={item.label}
          path={item.path}
          active={item.active}
          onClick={() => onItemClick(item.path)}
          variant="horizontal"
        />
      ))}
    </div>
  );
};

export default HorizontalMenu;
