
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
  const { menuItems, loading, error, isUserAdmin, initialized, refreshMenu } = useMenu({
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
    if (!menuItems || menuItems.length === 0) {
      console.log("DynamicMenu: No menu items available");
      return [];
    }
    
    if (!modulesInitialized) {
      console.log("DynamicMenu: Modules not initialized yet");
      return menuItems; // Retourner tous les éléments en attendant l'initialisation des modules
    }
    
    const filtered = menuItems
      .filter(item => {
        // Vérifier si le module est visible
        const moduleVisible = !item.module_code || isMenuItemVisible(item.module_code);
        
        // Normaliser le chemin
        const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
        
        // Vérifier si la route existe
        const validRoute = routeExists(normalizedPath);
        
        const isVisible = moduleVisible && validRoute && item.is_visible !== false;
        
        if (!isVisible) {
          console.log(`Menu item "${item.name}" is filtered out:`, 
            `moduleVisible=${moduleVisible}, validRoute=${validRoute}, is_visible=${item.is_visible}`);
        }
        
        return isVisible;
      })
      .sort((a, b) => {
        // Utiliser position si défini, sinon order
        if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position;
        }
        return (a.order || 999) - (b.order || 999);
      });
    
    console.log(`DynamicMenu: Filtered ${filtered.length}/${menuItems.length} visible menu items for category: ${category || 'all'}`);
    return filtered;
  }, [menuItems, isMenuItemVisible, modulesInitialized, category]);

  // Gérer la navigation
  const handleNavigate = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Normaliser le chemin pour la navigation
    let targetPath = path;
    if (!targetPath.startsWith('/')) {
      targetPath = `/${targetPath}`;
    }
    
    console.log(`Navigating to: ${targetPath}`);
    
    // Forcer la navigation même si on est déjà sur le chemin
    if (location.pathname === targetPath) {
      // Pour forcer un rafraîchissement sans recharger la page
      navigate('/', { replace: true });
      setTimeout(() => navigate(targetPath), 10);
    } else {
      navigate(targetPath);
    }
  };

  // Afficher un état de chargement (minimal et silencieux)
  if (loading && !menuItems.length) {
    return <MenuLoadingState />;
  }

  // Afficher un état d'erreur (minimal)
  if (error) {
    return <MenuErrorState message={error} />;
  }

  // Afficher l'état vide
  if (visibleMenuItems.length === 0) {
    return <MenuEmptyState 
      category={category} 
      isUserAdmin={isUserAdmin} 
      isInitialized={initialized} 
    />;
  }

  // Rendre le menu hiérarchique ou standard
  return hierarchical ? (
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
