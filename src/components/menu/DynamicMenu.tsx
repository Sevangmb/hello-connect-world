
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMenu } from "@/hooks/menu";
import { MenuItemCategory } from "@/services/menu/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { useModules } from "@/hooks/modules/useModules";

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
  const { menuItems, loading, error, isUserAdmin, refreshMenu } = useMenu({
    category,
    moduleCode,
    hierarchical,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { modules } = useModules();

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
  
  // Vérifier si un menu est visible
  const isMenuItemVisible = (moduleCode: string | null) => {
    if (!moduleCode) return true;
    
    // Si c'est un module admin et que l'utilisateur est admin, toujours visible
    if ((moduleCode === 'admin' || moduleCode.startsWith('admin_')) && isUserAdmin) {
      return true;
    }
    
    // Sinon vérifier avec le coordinateur
    return moduleMenuCoordinator.isModuleVisibleInMenu(moduleCode, modules);
  };

  // Filtrer les éléments de menu selon leur visibilité
  const visibleMenuItems = menuItems.filter(item => !item.module_code || isMenuItemVisible(item.module_code));

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

  if (visibleMenuItems.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-2">
        {isUserAdmin && category === 'admin' 
          ? "Chargement du menu administrateur..." 
          : "Aucun élément de menu disponible"}
      </div>
    );
  }

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {visibleMenuItems.map((item) => (
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
