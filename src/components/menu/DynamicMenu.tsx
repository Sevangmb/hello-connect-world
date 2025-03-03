
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMenu } from "@/hooks/useMenu";
import { MenuItemCategory } from "@/services/menu/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type DynamicMenuProps = {
  category?: MenuItemCategory;
  moduleCode?: string;
  className?: string;
  hierarchical?: boolean;
};

export const DynamicMenu: React.FC<DynamicMenuProps> = ({
  category,
  moduleCode,
  className,
  hierarchical = false,
}) => {
  const { menuItems, loading, error } = useMenu({
    category,
    moduleCode,
    hierarchical,
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier si un chemin est actif
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Récupérer l'icône à partir de la bibliothèque Lucide
  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    
    // @ts-ignore - Les icônes sont dynamiques
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5 mr-2" /> : null;
  };

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm py-2">{error}</div>;
  }

  if (menuItems.length === 0) {
    return <div className="text-gray-500 text-sm py-2">Aucun élément de menu disponible</div>;
  }

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant={isActive(item.path) ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "justify-start font-medium",
            isActive(item.path) ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5"
          )}
          onClick={() => navigate(item.path)}
        >
          {getIcon(item.icon)}
          <span>{item.name}</span>
        </Button>
      ))}
    </nav>
  );
};

export default DynamicMenu;
