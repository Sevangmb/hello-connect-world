
import React from 'react';
import { MenuItem, MenuItemProps } from './MenuItem';
import { MenuItem as MenuItemType } from '@/hooks/menu/useMainMenuItems';

interface MenuSectionProps {
  item: {
    id: string;
    label: string;
    path: string;
    icon: React.ReactNode;
    active?: boolean;
    children?: MenuItemType[];
  };
  handleNavigate: (path: string) => void;
}

/**
 * Component to render a menu section with potential child items
 */
export const MenuSection: React.FC<MenuSectionProps> = ({ item, handleNavigate }) => {
  return (
    <React.Fragment>
      <MenuItem 
        label={item.label}
        path={item.path}
        icon={item.icon}
        active={item.active}
        onClick={() => handleNavigate(item.path)}
      />
      
      {item.children && item.active && (
        <div className="ml-4 mt-1 flex flex-col gap-1">
          {item.children.map((child) => (
            <MenuItem
              key={child.id}
              label={child.label}
              path={child.path}
              icon={child.icon}
              active={child.active}
              onClick={() => handleNavigate(child.path)}
            />
          ))}
        </div>
      )}
    </React.Fragment>
  );
};

export default MenuSection;
