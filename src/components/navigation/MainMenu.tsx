
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMainMenuItems } from "@/hooks/menu/useMainMenuItems";
import { HorizontalMenu, VerticalMenu } from "./MenuItems";

interface MainMenuProps {
  variant?: "horizontal" | "vertical";
  className?: string;
  onItemClick?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  variant = "horizontal", 
  className,
  onItemClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const { menuStructure } = useMainMenuItems(currentPath);
  
  const handleNavigate = (path: string) => {
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };
  
  if (variant === "horizontal") {
    return (
      <HorizontalMenu 
        items={menuStructure} 
        onItemClick={handleNavigate} 
        className={className} 
      />
    );
  }
  
  return (
    <VerticalMenu 
      items={menuStructure} 
      onItemClick={handleNavigate} 
      className={className} 
    />
  );
};

export default MainMenu;
