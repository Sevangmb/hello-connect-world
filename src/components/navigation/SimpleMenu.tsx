
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModules } from "@/hooks/modules/useModules";
import { useModuleVisibility } from "./hooks/useModuleVisibility";
import { useToast } from "@/hooks/use-toast";

// Type pour les éléments de menu
type SimpleMenuItem = {
  id: string;
  label: string; 
  path: string;
  icon?: React.ReactNode;
  children?: SimpleMenuItem[];
  moduleCode?: string;
  isAdmin?: boolean;
};

// Fonction pour convertir les modules en éléments de menu
const convertModulesToMenuItems = (modules: any[]): SimpleMenuItem[] => {
  // Données de base du menu
  const baseMenuItems: SimpleMenuItem[] = [
    {
      id: "home",
      label: "Accueil",
      path: "/",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      id: "explore",
      label: "Explorer",
      path: "/explore",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    },
    {
      id: "personal",
      label: "Mon Univers",
      path: "/personal",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
      children: [
        {
          id: "wardrobe",
          label: "Ma Garde-robe",
          path: "/personal",
          moduleCode: "wardrobe"
        },
        {
          id: "outfits",
          label: "Mes Tenues",
          path: "/outfits",
          moduleCode: "wardrobe"
        },
        {
          id: "suitcases",
          label: "Mes Valises",
          path: "/suitcases",
          moduleCode: "wardrobe"
        }
      ]
    },
    {
      id: "search",
      label: "Recherche",
      path: "/search",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    },
    {
      id: "notifications",
      label: "Notifications",
      path: "/notifications",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
    },
    {
      id: "profile",
      label: "Profil",
      path: "/profile",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      children: [
        {
          id: "settings",
          label: "Paramètres",
          path: "/profile/settings",
        }
      ]
    }
  ];

  // Ajouter les modules dynamiquement
  const moduleMenuItems = modules
    .filter(module => module.status === 'active' || module.status === 'degraded')
    .map(module => {
      // Créer un élément de menu pour chaque module
      const moduleMenuItem: SimpleMenuItem = {
        id: module.code,
        label: module.name,
        path: `/${module.code.toLowerCase()}`,
        moduleCode: module.code,
        children: []
      };

      // Ajouter des sous-menus en fonction du module
      if (module.code === 'social') {
        moduleMenuItem.path = "/social/challenges";
        moduleMenuItem.icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
        moduleMenuItem.children = [
          {
            id: "challenges",
            label: "Défis",
            path: "/social/challenges",
            moduleCode: "social"
          },
          {
            id: "friends",
            label: "Amis",
            path: "/social/friends",
            moduleCode: "social"
          },
          {
            id: "messages",
            label: "Messages",
            path: "/social/messages",
            moduleCode: "social"
          }
        ];
      } else if (module.code === 'shop') {
        moduleMenuItem.label = "Boutiques";
        moduleMenuItem.path = "/boutiques";
        moduleMenuItem.icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/></svg>;
      } else if (module.code === 'admin') {
        moduleMenuItem.path = "/admin/dashboard";
        moduleMenuItem.icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>;
        moduleMenuItem.isAdmin = true;
        moduleMenuItem.children = [
          {
            id: "admin-dashboard",
            label: "Tableau de bord",
            path: "/admin/dashboard",
            moduleCode: "admin",
            isAdmin: true
          },
          {
            id: "admin-users",
            label: "Utilisateurs",
            path: "/admin/users",
            moduleCode: "admin",
            isAdmin: true
          },
          {
            id: "admin-modules",
            label: "Modules",
            path: "/admin/modules",
            moduleCode: "admin",
            isAdmin: true
          },
          {
            id: "admin-settings",
            label: "Paramètres",
            path: "/admin/settings",
            moduleCode: "admin",
            isAdmin: true
          }
        ];
      }

      return moduleMenuItem;
    });

  // Fusionner les menus de base avec les menus de modules
  const allMenuItems: SimpleMenuItem[] = [...baseMenuItems];
  
  // Ajouter uniquement les modules qui ne sont pas déjà inclus dans le menu de base
  moduleMenuItems.forEach(moduleItem => {
    if (!allMenuItems.some(item => item.id === moduleItem.id)) {
      allMenuItems.push(moduleItem);
    }
  });

  return allMenuItems;
};

// Composant pour un élément de menu
const MenuItem: React.FC<{
  item: SimpleMenuItem;
  isActive: boolean;
  depth: number;
  openItems: string[];
  toggleItem: (id: string) => void;
  onNavigate: (path: string) => void;
  isModuleActive: (moduleCode?: string) => boolean;
  isUserAdmin: boolean;
}> = ({ item, isActive, depth, openItems, toggleItem, onNavigate, isModuleActive, isUserAdmin }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openItems.includes(item.id);
  
  // Vérifier si l'élément doit être affiché en fonction du module et des permissions d'administrateur
  const isVisible = () => {
    if (item.isAdmin && !isUserAdmin) {
      return false;
    }
    
    if (item.moduleCode && !isModuleActive(item.moduleCode)) {
      return false;
    }
    
    return true;
  };
  
  if (!isVisible()) {
    return null;
  }
  
  // Padding basé sur la profondeur
  const paddingLeft = `${(depth + 1) * 8}px`;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (hasChildren) {
      toggleItem(item.id);
    } else {
      onNavigate(item.path);
    }
  };
  
  return (
    <div>
      <div 
        className={cn(
          "flex items-center justify-between py-2 px-3 rounded-md transition-colors cursor-pointer",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "text-gray-700 hover:bg-gray-100"
        )}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        <div className="flex items-center">
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.label}</span>
        </div>
        
        {hasChildren && (
          <span>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        )}
      </div>
      
      {hasChildren && isOpen && (
        <div className="ml-2">
          {item.children!.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              isActive={isActive && child.path === location.pathname}
              depth={depth + 1}
              openItems={openItems}
              toggleItem={toggleItem}
              onNavigate={onNavigate}
              isModuleActive={isModuleActive}
              isUserAdmin={isUserAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Interface pour le composant principal
interface SimpleMenuProps {
  className?: string;
}

// Composant de menu principal
export const SimpleMenu: React.FC<SimpleMenuProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const { modules, isModuleActive, loading, isInitialized } = useModules();
  const { isUserAdmin } = useModuleVisibility("main");
  const [dynamicMenuItems, setDynamicMenuItems] = useState<SimpleMenuItem[]>([]);
  const { toast } = useToast();
  
  // Charger les éléments de menu basés sur les modules
  useEffect(() => {
    if (isInitialized && modules.length > 0) {
      try {
        const menuItems = convertModulesToMenuItems(modules);
        console.log("Menu items generated from modules:", menuItems.length);
        setDynamicMenuItems(menuItems);
      } catch (error) {
        console.error("Erreur lors de la génération du menu:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le menu",
          variant: "destructive"
        });
      }
    }
  }, [modules, isInitialized, toast]);
  
  // Fonction pour vérifier si un chemin est actif
  const isPathActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Fonction pour basculer l'état d'ouverture d'un élément
  const toggleItem = (id: string) => {
    setOpenItems((prevItems) =>
      prevItems.includes(id)
        ? prevItems.filter((item) => item !== id)
        : [...prevItems, id]
    );
  };
  
  // Fonction pour la navigation
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  // État de chargement
  if (loading && dynamicMenuItems.length === 0) {
    return (
      <div className="flex flex-col space-y-1 px-3 py-2">
        <div className="animate-pulse h-6 bg-gray-200 rounded mb-2"></div>
        <div className="animate-pulse h-6 bg-gray-200 rounded mb-2"></div>
        <div className="animate-pulse h-6 bg-gray-200 rounded mb-2"></div>
      </div>
    );
  }
  
  // Vérification de l'activité du module
  const checkModuleActive = (moduleCode?: string): boolean => {
    if (!moduleCode) return true;
    return isModuleActive(moduleCode);
  };
  
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {dynamicMenuItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          isActive={isPathActive(item.path)}
          depth={0}
          openItems={openItems}
          toggleItem={toggleItem}
          onNavigate={handleNavigate}
          isModuleActive={checkModuleActive}
          isUserAdmin={isUserAdmin}
        />
      ))}
    </div>
  );
};

export default SimpleMenu;
