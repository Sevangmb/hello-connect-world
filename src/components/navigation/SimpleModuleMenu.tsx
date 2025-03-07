
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MenuStructureTransformer } from "@/services/menu/infrastructure/utils/MenuStructureTransformer";
import { eventBus, EVENTS } from "@/services/events/EventBus";
import { getIcon } from "@/components/menu/utils/menuUtils";
import { useModules } from "@/hooks/modules/useModules";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MenuItem } from "@/services/menu/types";
import { useMenuItemsByCategory } from "@/hooks/menu";

interface SimpleModuleMenuProps {
  modules: string[];
  title?: string;
}

interface ModuleMenuItemProps {
  category: string;
  isActive: boolean;
  level?: number;
}

export const SimpleModuleMenu: React.FC<SimpleModuleMenuProps> = ({ modules, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const { isModuleActive } = useModules();
  
  // Effet pour développer automatiquement les catégories actives
  useEffect(() => {
    const currentPath = location.pathname;
    const activeCategories: string[] = [];
    
    // Pour chaque catégorie principale, vérifier si elle est active
    modules.forEach(moduleCode => {
      const routePath = MenuStructureTransformer.getRoutePathForMenuItem(moduleCode);
      if (currentPath === routePath || currentPath.startsWith(`${routePath}/`)) {
        activeCategories.push(moduleCode);
        
        // Vérifier les sous-catégories
        const subcategories = MenuStructureTransformer.getSubcategoriesForSection(moduleCode);
        subcategories.forEach(subcat => {
          const subRoutePath = MenuStructureTransformer.getRoutePathForMenuItem(subcat as string);
          if (currentPath === subRoutePath || currentPath.startsWith(`${subRoutePath}/`)) {
            activeCategories.push(subcat as string);
          }
        });
      }
    });
    
    if (activeCategories.length > 0) {
      setExpandedCategories(prev => {
        const newExpanded = [...prev];
        activeCategories.forEach(cat => {
          if (!newExpanded.includes(cat)) {
            newExpanded.push(cat);
          }
        });
        return newExpanded;
      });
    }
  }, [location.pathname, modules]);

  // Fonction pour naviguer vers une route
  const handleNavigate = (path: string) => {
    console.log(`Navigation vers: ${path}`);
    
    // Publier l'événement de changement de route
    eventBus.publish(EVENTS.NAVIGATION.ROUTE_CHANGED, {
      from: location.pathname,
      to: path
    });
    
    navigate(path);
  };
  
  // Gérer l'expansion des catégories
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };
  
  // Filtrer les modules actifs
  const activeModules = modules.filter(moduleCode => {
    // Les modules de base sont toujours actifs
    if (['main', 'explore', 'personal', 'social', 'profile'].includes(moduleCode)) {
      return true;
    }
    
    // Pour les autres, vérifier leur statut
    const module = MenuStructureTransformer.getModuleForCategory(moduleCode);
    if (!module) return true;
    
    return isModuleActive(module);
  });

  if (activeModules.length === 0) {
    return null;
  }

  return (
    <div className="px-2">
      {title && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 hidden">
          {title}
        </h3>
      )}
      
      <div className="space-y-1">
        {activeModules.map(moduleCode => (
          <ModuleMenuItem 
            key={moduleCode}
            category={moduleCode}
            isActive={location.pathname === MenuStructureTransformer.getRoutePathForMenuItem(moduleCode)}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

// Composant d'élément de menu pour un module
const ModuleMenuItem: React.FC<ModuleMenuItemProps> = ({ category, isActive, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: menuItems } = useMenuItemsByCategory(category);
  
  // Liste des sous-catégories
  const subcategories = MenuStructureTransformer.getSubcategoriesForSection(category);
  const hasChildren = subcategories.length > 0;
  
  // Déterminer le nom à afficher
  const displayName = useMemo(() => {
    // Chercher dans les éléments de menu
    if (menuItems && menuItems.length > 0) {
      return menuItems[0].name;
    }
    
    // Noms par défaut
    const defaultNames: Record<string, string> = {
      main: 'Accueil',
      explore: 'Explorer',
      personal: 'Mon Univers',
      social: 'Communauté',
      profile: 'Profil',
      wardrobe: 'Ma Garde-robe',
      outfits: 'Mes Tenues',
      looks: 'Mes Looks',
      suitcases: 'Mes Valises',
      favorites: 'Mes Favoris',
      marketplace: 'Vide-Dressing',
      settings: 'Paramètres',
      admin: 'Administration',
      admin_dashboard: 'Tableau de bord',
      admin_users: 'Utilisateurs',
      admin_content: 'Contenu',
      shop_dashboard: 'Tableau de bord',
      shop_storefront: 'Vitrine',
      shop_orders: 'Commandes'
    };
    
    return defaultNames[category] || category.replace(/_/g, ' ');
  }, [category, menuItems]);
  
  // Obtenir l'icône
  const getMenuIcon = () => {
    // Icônes par défaut
    const defaultIcons: Record<string, string> = {
      main: 'Home',
      explore: 'Search',
      personal: 'User',
      social: 'Users',
      profile: 'UserCircle',
      wardrobe: 'Shirt',
      outfits: 'Layers',
      looks: 'Camera',
      suitcases: 'Luggage',
      favorites: 'Heart',
      marketplace: 'ShoppingBag',
      settings: 'Settings',
      admin: 'Shield',
      shop_dashboard: 'LayoutDashboard',
      shop_storefront: 'Store',
      shop_orders: 'Package'
    };
    
    const iconName = defaultIcons[category] || 'Circle';
    const IconComponent = getIcon(iconName);
    
    if (IconComponent) {
      return <IconComponent className="h-4 w-4 mr-2" />;
    }
    
    return null;
  };
  
  // Obtenir le chemin de la route
  const routePath = MenuStructureTransformer.getRoutePathForMenuItem(category);
  
  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      // Publier l'événement de clic sur un élément de menu
      eventBus.publish(EVENTS.NAVIGATION.MENU_ITEM_CLICKED, {
        itemCategory: category,
        path: routePath
      });
      
      navigate(routePath);
    }
  };
  
  // Style basé sur le niveau
  const paddingLeft = `${(level + 1) * 8}px`;
  
  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className={`w-full justify-start text-sm font-medium py-2 rounded-md transition-colors ${
          isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary'
        }`}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        <div className="flex items-center">
          {getMenuIcon()}
          <span>{displayName}</span>
        </div>
        
        {hasChildren && (
          <span className="ml-auto">
            {isExpanded ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </span>
        )}
      </Button>
      
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {subcategories.map(subcat => (
            <ModuleMenuItem
              key={subcat as string}
              category={subcat as string}
              isActive={location.pathname === MenuStructureTransformer.getRoutePathForMenuItem(subcat as string)}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
