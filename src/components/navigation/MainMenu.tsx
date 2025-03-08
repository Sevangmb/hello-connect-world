
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, Search, User, ShoppingBag, 
  Shirt, Layers, Briefcase, Heart, Users,
  MessageSquare, Bell, Settings
} from "lucide-react";

interface MainMenuProps {
  variant?: "horizontal" | "vertical";
  className?: string;
  onItemClick?: () => void;
}

interface MenuItemProps {
  label: string;
  path: string;
  icon: React.ReactNode;
  active: boolean;
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

export const MainMenu: React.FC<MainMenuProps> = ({ 
  variant = "horizontal", 
  className,
  onItemClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Structure hiérarchique du menu 
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
      active: currentPath.startsWith("/explore")
    },
    {
      id: "personal",
      label: "Mon Univers",
      path: "/personal",
      icon: <User className="h-4 w-4" />,
      active: currentPath.startsWith("/personal") || 
              currentPath.startsWith("/wardrobe") || 
              currentPath.startsWith("/outfits"),
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
        }
      ]
    },
    {
      id: "social",
      label: "Communauté",
      path: "/social",
      icon: <Users className="h-4 w-4" />,
      active: currentPath.startsWith("/social"),
      children: [
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
      active: currentPath.startsWith("/boutiques")
    },
    {
      id: "settings",
      label: "Paramètres",
      path: "/settings",
      icon: <Settings className="h-4 w-4" />,
      active: currentPath.startsWith("/settings")
    }
  ];
  
  const handleNavigate = (path: string) => {
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };
  
  // Pour le menu horizontal, afficher uniquement les éléments principaux
  if (variant === "horizontal") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {menuStructure.map((item) => (
          <Button
            key={item.id}
            variant={item.active ? "default" : "ghost"}
            size="sm"
            className={cn(
              item.active ? "bg-primary/10 text-primary" : ""
            )}
            onClick={() => handleNavigate(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    );
  }
  
  // Pour le menu vertical, afficher la structure complète avec enfants
  return (
    <div className={cn("flex flex-col gap-1", className)}>
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
  );
};
