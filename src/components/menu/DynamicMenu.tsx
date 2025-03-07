
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useMenu } from "@/hooks/menu";
import { MenuItemCategory } from "@/services/menu/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { useModules } from "@/hooks/modules/useModules";
import { useNavigation } from "@/components/navigation/hooks/useNavigation";

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
  const { menuItems, loading, error, isUserAdmin } = useMenu({
    category,
    moduleCode,
    hierarchical,
  });
  const { navigateTo } = useNavigation();
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
  
  // Mémoiser la vérification de visibilité pour éviter des recalculs inutiles
  const isMenuItemVisible = useMemo(() => {
    return (moduleCode: string | null) => {
      if (!moduleCode) return true;
      
      // Si c'est un module admin et que l'utilisateur est admin, toujours visible
      if ((moduleCode === 'admin' || moduleCode.startsWith('admin_')) && isUserAdmin) {
        return true;
      }
      
      // Sinon vérifier avec le coordinateur
      return moduleMenuCoordinator.isModuleVisibleInMenu(moduleCode, modules);
    };
  }, [isUserAdmin, modules]);

  // Mémoiser les éléments de menu filtrés pour éviter des re-rendus inutiles
  const visibleMenuItems = useMemo(() => {
    return menuItems.filter(item => !item.module_code || isMenuItemVisible(item.module_code));
  }, [menuItems, isMenuItemVisible]);

  // Optimisation du rendu pour éviter le clignotement
  if (loading) {
    // Utiliser un effet de skeleton fixe pour éviter les effets de clignotement
    return (
      <div className={cn("space-y-2", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2 p-2 h-9">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-32" />
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

  // Fonction pour gérer les clics sur les éléments de menu
  const handleMenuItemClick = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log(`DynamicMenu: Clic sur élément de menu avec chemin ${path}`);
    
    // Utiliser la fonction navigateTo du hook personnalisé
    navigateTo(path, event);
  };

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
          onClick={(e) => handleMenuItemClick(item.path, e)}
        >
          {getIcon(item.icon)}
          <span>{item.name}</span>
        </Button>
      ))}
    </nav>
  );
};

export default DynamicMenu;
