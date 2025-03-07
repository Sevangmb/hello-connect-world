
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface MenuLinkProps {
  path: string;
  name: string;
  icon?: string | null;
  className?: string;
}

export const MenuLink: React.FC<MenuLinkProps> = ({
  path,
  name,
  icon,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Normaliser le chemin
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Vérifier si le chemin est actif
  const isActive = () => {
    const currentPath = location.pathname;
    
    if (normalizedPath === '/') {
      return currentPath === '/';
    }
    
    return currentPath === normalizedPath || 
           currentPath.startsWith(`${normalizedPath}/`);
  };
  
  // Récupérer l'icône
  const getIcon = () => {
    if (!icon) return null;
    
    // @ts-ignore - Les icônes sont dynamiques
    const IconComponent = LucideIcons[icon];
    return IconComponent ? <IconComponent className="h-5 w-5 mr-2" /> : null;
  };
  
  // Gérer la navigation
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log(`MenuLink: Navigation vers ${normalizedPath}`);
    navigate(normalizedPath);
  };
  
  return (
    <Button
      variant={isActive() ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "justify-start font-medium",
        isActive() ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5",
        className
      )}
      onClick={handleClick}
    >
      {getIcon()}
      <span>{name}</span>
    </Button>
  );
};

export default MenuLink;
