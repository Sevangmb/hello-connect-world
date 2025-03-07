
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const { menuItems, loading, error, isUserAdmin } = useMenu({
    category,
    moduleCode,
    hierarchical,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { modules, isInitialized } = useModules();

  // Vérifier si un chemin est actif
  const isActive = (path: string) => {
    // Normaliser le chemin pour la comparaison
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const normalizedCurrentPath = location.pathname;
    
    if (normalizedPath === '/') {
      return normalizedCurrentPath === '/' || normalizedCurrentPath === '';
    }
    
    return normalizedCurrentPath === normalizedPath || 
           normalizedCurrentPath.startsWith(`${normalizedPath}/`);
  };

  // Récupérer l'icône à partir de la bibliothèque Lucide
  const getIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    
    // @ts-ignore - Les icônes sont dynamiques
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5 mr-2" /> : null;
  };
  
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

  // Liste des routes valides existantes
  const validRoutes = useMemo(() => {
    return [
      '/',
      '/explore',
      '/personal',
      '/profile',
      '/profile/settings',
      '/search',
      '/notifications',
      '/social/challenges',
      '/social/friends',
      '/social/messages',
      '/wardrobe/outfits',
      '/wardrobe/suitcases',
      '/boutiques',
      '/cart',
      '/admin/dashboard',
      '/admin/modules', 
      '/admin/users',
      '/admin/shops',
      '/admin/settings',
      '/legal',
      '/terms',
      '/privacy',
      '/contact',
      '/about',
      '/stores',
      '/shop',
      '/challenges',
      '/messages',
      '/friends',
      '/outfits',
      '/suitcases'
    ];
  }, []);

  // Filtrer les éléments de menu visibles et vérifier si les routes existent
  const visibleMenuItems = useMemo(() => {
    if (!menuItems || !isInitialized) return [];
    
    return menuItems
      .filter(item => {
        // Vérifier si le module est visible
        const moduleVisible = !item.module_code || isMenuItemVisible(item.module_code);
        
        // Normaliser le chemin
        const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
        
        // Vérifier si la route existe (soit directement soit comme préfixe)
        const routeExists = validRoutes.some(route => 
          route === normalizedPath || 
          route.startsWith(`${normalizedPath}/`) ||
          normalizedPath.startsWith(`${route}/`)
        );
        
        return moduleVisible && routeExists && item.is_visible !== false;
      })
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  }, [menuItems, isMenuItemVisible, isInitialized, validRoutes]);

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {[...Array(3)].map((_, i) => (
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

  if (!isInitialized) {
    return (
      <div className="text-gray-500 text-sm py-2">
        Chargement des éléments de menu...
      </div>
    );
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

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {visibleMenuItems.map((item) => {
        // Normaliser le chemin pour la comparaison
        const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
        
        return (
          <Button
            key={item.id}
            variant={isActive(normalizedPath) ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "justify-start font-medium w-full py-2",
              isActive(normalizedPath) ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5"
            )}
            onClick={(e) => handleNavigate(normalizedPath, e)}
          >
            {getIcon(item.icon)}
            <span>{item.name}</span>
          </Button>
        );
      })}
    </nav>
  );
};
