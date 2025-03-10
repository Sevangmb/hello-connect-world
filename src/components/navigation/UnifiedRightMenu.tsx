
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@/components/UserButton";
import { useMenu } from "@/hooks/menu";
import { cn } from "@/lib/utils";
import { 
  Home, Search, User, ShoppingBag, 
  Shirt, Layers, Briefcase, Heart, Users, 
  MessageSquare, Bell, Settings, Shield,
  LayoutDashboard, UserCog, Store, Package,
  FileText, BarChart, Mail, Menu
} from "lucide-react";
import { useAdminStatus } from '@/hooks/menu/useAdminStatus';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MenuItemProps {
  label: string;
  path: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, active, onClick }) => {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      className={cn(
        "w-full justify-start gap-2",
        active ? "bg-primary/10 text-primary" : ""
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

interface AdminMenuSectionProps {
  isExpanded?: boolean;
  currentPath: string;
  handleNavigate: (path: string) => void;
}

const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ 
  isExpanded = false,
  currentPath,
  handleNavigate
}) => {
  const [isOpen, setIsOpen] = useState(isExpanded);
  
  const adminItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: currentPath === "/admin/dashboard"
    },
    {
      id: "users",
      label: "Utilisateurs",
      path: "/admin/users",
      icon: <UserCog className="h-4 w-4" />,
      active: currentPath.startsWith("/admin/users")
    },
    {
      id: "shops",
      label: "Boutiques",
      path: "/admin/shops",
      icon: <Store className="h-4 w-4" />,
      active: currentPath.startsWith("/admin/shops")
    },
    {
      id: "modules",
      label: "Modules",
      path: "/admin/modules",
      icon: <Package className="h-4 w-4" />,
      active: currentPath.startsWith("/admin/modules")
    },
    {
      id: "content",
      label: "Contenu",
      path: "/admin/content",
      icon: <FileText className="h-4 w-4" />,
      active: currentPath.startsWith("/admin/content")
    },
    {
      id: "stats",
      label: "Statistiques",
      path: "/admin/stats",
      icon: <BarChart className="h-4 w-4" />,
      active: currentPath.startsWith("/admin/stats")
    },
    {
      id: "campaigns",
      label: "Campagnes",
      path: "/admin/campaigns",
      icon: <Mail className="h-4 w-4" />,
      active: currentPath.startsWith("/admin/campaigns")
    },
    {
      id: "settings",
      label: "Configuration",
      path: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
      active: currentPath.startsWith("/admin/settings")
    }
  ];

  return (
    <>
      <Separator className="my-4" />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between items-center text-left mb-1"
          >
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span className="font-semibold">Administration</span>
            </div>
            <Menu className={cn(
              "h-4 w-4 transition-transform", 
              isOpen ? "rotate-90" : "rotate-0"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pl-2 flex flex-col gap-1 mt-1">
            {adminItems.map((item) => (
              <MenuItem
                key={item.id}
                label={item.label}
                path={item.path}
                icon={item.icon}
                active={item.active}
                onClick={() => handleNavigate(item.path)}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

interface UnifiedRightMenuProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  currentPath?: string; // Accepter le chemin actuel comme prop pour éviter les re-rendus
}

export const UnifiedRightMenu: React.FC<UnifiedRightMenuProps> = ({
  className,
  isMobileOpen = false,
  onMobileClose,
  currentPath: propCurrentPath
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeCurrentPath = location.pathname;
  
  // Utiliser le chemin passé en prop ou celui de la route actuelle
  const currentPath = propCurrentPath || routeCurrentPath;
  
  const { isUserAdmin } = useAdminStatus();
  
  const menuClasses = useMemo(() => cn(
    "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col",
    "md:sticky md:pt-20 md:translate-x-0 transition-all duration-200 ease-out",
    isMobileOpen ? "translate-x-0 shadow-lg" : "-translate-x-full md:translate-x-0",
    className
  ), [isMobileOpen, className]);
  
  const overlayClasses = useMemo(() => cn(
    "fixed inset-0 bg-black/50 z-40 md:hidden",
    isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
    "transition-opacity duration-200 ease-out"
  ), [isMobileOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Fonction optimisée pour vérifier si un chemin est actif
  const isPathActive = (path: string): boolean => {
    // Cas spécial pour la page d'accueil
    if (path === '/' && currentPath === '/') return true;
    
    // Si nous sommes sur une page "personal", considérer tous les chemins liés comme actifs
    if (currentPath === '/personal' && (
      path === '/wardrobe' || 
      path === '/outfits' || 
      path === '/wardrobe/suitcases' ||
      path === '/favorites' ||
      path === '/profile'
    )) {
      return true;
    }
    
    // Pour les autres routes, vérifier si le chemin actuel commence par le chemin donné
    if (path !== '/') {
      return currentPath === path || 
             currentPath.startsWith(`${path}/`);
    }
    
    return false;
  };
  
  // Définition mémorisée des sous-éléments personnels
  const personalSubItems = useMemo(() => [
    {
      id: "wardrobe",
      label: "Garde-robe",
      path: "/wardrobe",
      icon: <Shirt className="h-4 w-4" />,
      active: isPathActive("/wardrobe") && !currentPath.includes("/suitcases")
    },
    {
      id: "outfits",
      label: "Mes Tenues",
      path: "/outfits",
      icon: <Layers className="h-4 w-4" />,
      active: isPathActive("/outfits")
    },
    {
      id: "suitcases",
      label: "Mes Valises",
      path: "/wardrobe/suitcases",
      icon: <Briefcase className="h-4 w-4" />,
      active: isPathActive("/wardrobe/suitcases") || isPathActive("/suitcases")
    },
    {
      id: "favorites",
      label: "Mes Favoris",
      path: "/favorites",
      icon: <Heart className="h-4 w-4" />,
      active: isPathActive("/favorites")
    },
    {
      id: "profile",
      label: "Mon Profil",
      path: "/profile",
      icon: <User className="h-4 w-4" />,
      active: isPathActive("/profile") && !currentPath.startsWith("/profile/settings")
    }
  ], [currentPath]);
  
  // Définition mémorisée des sous-éléments sociaux
  const socialSubItems = useMemo(() => [
    {
      id: "friends",
      label: "Amis",
      path: "/friends",
      icon: <Users className="h-4 w-4" />,
      active: isPathActive("/friends")
    },
    {
      id: "messages",
      label: "Messages",
      path: "/messages",
      icon: <MessageSquare className="h-4 w-4" />,
      active: isPathActive("/messages")
    },
    {
      id: "notifications",
      label: "Notifications",
      path: "/notifications",
      icon: <Bell className="h-4 w-4" />,
      active: isPathActive("/notifications")
    }
  ], [currentPath]);
  
  // Vérifier si une catégorie est active de façon mémorisée
  const isPersonalActive = useMemo(() => 
    personalSubItems.some(item => item.active) || currentPath === '/personal',
  [personalSubItems, currentPath]);
  
  const isSocialActive = useMemo(() => 
    socialSubItems.some(item => item.active),
  [socialSubItems]);

  // Structure du menu mémorisée pour éviter les recalculs inutiles
  const menuStructure = useMemo(() => [
    {
      id: "home",
      label: "Accueil",
      path: "/",
      icon: <Home className="h-4 w-4" />,
      active: currentPath === "/"
    },
    {
      id: "explore",
      label: "Explorer",
      path: "/explore",
      icon: <Search className="h-4 w-4" />,
      active: isPathActive("/explore") || 
              isPathActive("/search") ||
              isPathActive("/trends")
    },
    {
      id: "personal",
      label: "Mon Univers",
      path: "/personal",
      icon: <User className="h-4 w-4" />,
      active: isPersonalActive,
      children: personalSubItems
    },
    {
      id: "social",
      label: "Communauté",
      path: "/social",
      icon: <Users className="h-4 w-4" />,
      active: isSocialActive,
      children: socialSubItems
    },
    {
      id: "boutiques",
      label: "Boutiques",
      path: "/boutiques",
      icon: <ShoppingBag className="h-4 w-4" />,
      active: isPathActive("/boutiques") || isPathActive("/shops") || isPathActive("/stores")
    },
    {
      id: "settings",
      label: "Paramètres",
      path: "/profile/settings",
      icon: <Settings className="h-4 w-4" />,
      active: isPathActive("/settings") || isPathActive("/profile/settings")
    }
  ], [currentPath, isPersonalActive, isSocialActive, personalSubItems, socialSubItems]);

  return (
    <>
      <div 
        className={overlayClasses}
        onClick={onMobileClose}
      />
      
      <aside className={menuClasses}>
        <div className="px-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer le menu</span>
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex-1 px-3 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            <div className="flex flex-col gap-1">
              {menuStructure.map((item) => (
                <React.Fragment key={item.id}>
                  <MenuItem 
                    label={item.label}
                    path={item.path}
                    icon={item.icon}
                    active={item.active}
                    onClick={() => handleNavigate(item.path)}
                  />
                  
                  {item.children && item.active && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {item.children.map((child) => (
                        <MenuItem
                          key={child.id}
                          label={child.label}
                          path={child.path}
                          icon={child.icon}
                          active={child.active}
                          onClick={() => handleNavigate(child.path)}
                        />
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {isUserAdmin && (
              <AdminMenuSection 
                isExpanded={currentPath.startsWith("/admin")}
                currentPath={currentPath}
                handleNavigate={handleNavigate}
              />
            )}
          </ScrollArea>
        </div>
        
        <div className="px-3 mt-2 mb-2">
          <UserButton className="w-full" />
        </div>
      </aside>
    </>
  );
};

export default UnifiedRightMenu;
