
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

// Composant pour un élément de menu individuel
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

// Sous-composant pour la section administration
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
}

export const UnifiedRightMenu: React.FC<UnifiedRightMenuProps> = ({
  className,
  isMobileOpen = false,
  onMobileClose
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isUserAdmin } = useAdminStatus();
  
  // Classes CSS optimisées et mémorisées
  const menuClasses = useMemo(() => cn(
    "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col",
    "md:z-30 md:pt-20 md:translate-x-0 transition-transform duration-200 ease-out",
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

  // Structure hiérarchique du menu - Unifiée et organisée
  const menuStructure = [
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
      active: currentPath.startsWith("/explore") || 
              currentPath.startsWith("/search") ||
              currentPath.startsWith("/trends")
    },
    {
      id: "personal",
      label: "Mon Univers",
      path: "/wardrobe",
      icon: <User className="h-4 w-4" />,
      active: currentPath === "/wardrobe" || 
              currentPath.startsWith("/personal") || 
              currentPath.startsWith("/wardrobe") || 
              currentPath.startsWith("/outfits") ||
              currentPath.startsWith("/profile"),
      children: [
        {
          id: "wardrobe",
          label: "Garde-robe",
          path: "/wardrobe",
          icon: <Shirt className="h-4 w-4" />,
          active: currentPath.startsWith("/wardrobe")
        },
        {
          id: "outfits",
          label: "Mes Tenues",
          path: "/outfits",
          icon: <Layers className="h-4 w-4" />,
          active: currentPath.startsWith("/outfits")
        },
        {
          id: "suitcases",
          label: "Mes Valises",
          path: "/suitcases",
          icon: <Briefcase className="h-4 w-4" />,
          active: currentPath.startsWith("/suitcases")
        },
        {
          id: "favorites",
          label: "Favoris",
          path: "/favorites",
          icon: <Heart className="h-4 w-4" />,
          active: currentPath.startsWith("/favorites")
        },
        {
          id: "profile",
          label: "Mon Profil",
          path: "/profile",
          icon: <User className="h-4 w-4" />,
          active: currentPath.startsWith("/profile") && !currentPath.startsWith("/profile/settings")
        }
      ]
    },
    {
      id: "social",
      label: "Communauté",
      path: "/social",
      icon: <Users className="h-4 w-4" />,
      active: currentPath.startsWith("/social") ||
              currentPath.startsWith("/friends") ||
              currentPath.startsWith("/messages") ||
              currentPath.startsWith("/notifications"),
      children: [
        {
          id: "friends",
          label: "Amis",
          path: "/friends",
          icon: <Users className="h-4 w-4" />,
          active: currentPath.startsWith("/friends")
        },
        {
          id: "messages",
          label: "Messages",
          path: "/messages",
          icon: <MessageSquare className="h-4 w-4" />,
          active: currentPath.startsWith("/messages")
        },
        {
          id: "notifications",
          label: "Notifications",
          path: "/notifications",
          icon: <Bell className="h-4 w-4" />,
          active: currentPath.startsWith("/notifications")
        }
      ]
    },
    {
      id: "boutiques",
      label: "Boutiques",
      path: "/boutiques",
      icon: <ShoppingBag className="h-4 w-4" />,
      active: currentPath.startsWith("/boutiques") || currentPath.startsWith("/shops") || currentPath.startsWith("/stores")
    },
    {
      id: "settings",
      label: "Paramètres",
      path: "/profile/settings",
      icon: <Settings className="h-4 w-4" />,
      active: currentPath.startsWith("/settings") || currentPath.startsWith("/profile/settings")
    }
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      <div 
        className={overlayClasses}
        onClick={onMobileClose}
      />
      
      {/* Menu unifié à gauche */}
      <aside className={menuClasses}>
        {/* En-tête avec bouton de fermeture */}
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
        
        {/* Menu principal avec structure hiérarchique */}
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
                  
                  {/* Afficher les sous-éléments si le parent est actif */}
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
            
            {/* Section Admin conditionnelle avec composant dédié */}
            {isUserAdmin && (
              <AdminMenuSection 
                isExpanded={currentPath.startsWith("/admin")}
                currentPath={currentPath}
                handleNavigate={handleNavigate}
              />
            )}
          </ScrollArea>
        </div>
        
        {/* Profil utilisateur */}
        <div className="px-3 mt-2 mb-2">
          <UserButton className="w-full" />
        </div>
      </aside>
    </>
  );
};

export default UnifiedRightMenu;
