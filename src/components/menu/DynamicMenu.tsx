
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMenu } from "@/hooks/menu";
import { MenuItemCategory } from "@/services/menu/types";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { useModules } from "@/hooks/modules/useModules";
import { MenuLoadingState } from "./components/MenuLoadingState";
import { MenuErrorState } from "./components/MenuErrorState";
import { MenuEmptyState } from "./components/MenuEmptyState";
import { HierarchicalMenu } from "./components/HierarchicalMenu";
import { StandardMenu } from "./components/StandardMenu";
import { routeExists } from "./utils/menuUtils";

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
  const { menuItems, loading, error, isUserAdmin, isInitialized } = useMenu({
    category,
    moduleCode,
    hierarchical,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { modules, isInitialized: modulesInitialized } = useModules();
  
  // Mémoriser la vérification de visibilité des modules
  const isMenuItemVisible = useMemo(() => {
    return (moduleCode: string | null | undefined) => {
      if (!moduleCode) return true;
      
      // Si c'est un module admin et que l'utilisateur est admin, toujours visible
      if ((moduleCode === 'admin' || moduleCode.startsWith('admin_')) && isUserAdmin) {
        return true;
      }
      
      // Vérifier avec le coordinateur
      return moduleMenuCoordinator.isModuleVisibleInMenu(moduleCode, modules);
    };
  }, [isUserAdmin, modules]);

  // Filtrer les éléments de menu visibles et vérifier si les routes existent
  const visibleMenuItems = useMemo(() => {
    if (!menuItems || !modulesInitialized) return [];
    
    return menuItems
      .filter(item => {
        // Vérifier si le module est visible
        const moduleVisible = !item.module_code || isMenuItemVisible(item.module_code);
        
        // Normaliser le chemin
        const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
        
        // Vérifier si la route existe
        const validRoute = routeExists(normalizedPath);
        
        return moduleVisible && validRoute && item.is_visible !== false;
      })
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  }, [menuItems, isMenuItemVisible, modulesInitialized]);

  // Gérer la navigation
  const handleNavigate = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Normaliser le chemin pour la navigation
    let targetPath = path;
    if (!targetPath.startsWith('/')) {
      targetPath = `/${targetPath}`;
    }
    
    console.log(`DynamicMenu: Navigation vers ${targetPath}`);
    
    // Forcer la navigation même si on est déjà sur le chemin
    if (location.pathname === targetPath) {
      // Pour forcer un rafraîchissement sans recharger la page
      navigate('/', { replace: true });
      setTimeout(() => navigate(targetPath), 10);
    } else {
      navigate(targetPath);
    }
  };

  // Afficher un état de chargement
  if (loading) {
    return <MenuLoadingState className={className} />;
  }

  // Afficher un état d'erreur
  if (error) {
    return <MenuErrorState />;
  }

  // Afficher l'état non-initialisé
  if (!modulesInitialized) {
    return <MenuEmptyState isInitialized={false} />;
  }

  // Afficher l'état vide
  if (visibleMenuItems.length === 0) {
    return <MenuEmptyState isUserAdmin={isUserAdmin} category={category} />;
  }

  // Rendre le menu hiérarchique ou standard
  return hierarchical && category === 'admin' ? (
    <HierarchicalMenu 
      menuItems={visibleMenuItems} 
      className={className} 
      onNavigate={handleNavigate}
      currentPath={location.pathname}
    />
  ) : (
    <StandardMenu 
      menuItems={visibleMenuItems} 
      className={className} 
      onNavigate={handleNavigate}
      currentPath={location.pathname}
    />
  );
};
