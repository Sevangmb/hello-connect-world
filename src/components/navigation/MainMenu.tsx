
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
  
  // Helper function to check if a path is active, considering nested routes
  const isPathActive = (path: string): boolean => {
    // Exact match for home
    if (path === '/' && currentPath === '/') return true;
    
    // For other routes, check if current path starts with the given path
    // but ensure we're checking complete path segments to avoid partial matches
    if (path !== '/') {
      return currentPath === path || 
             currentPath.startsWith(`${path}/`);
    }
    
    return false;
  };
  
  // Define sub-categories and their active states
  const personalSubItems = [
    {
      id: "wardrobe",
      label: "Garde-robe",
      path: "/wardrobe",
      icon: <Shirt className="h-4 w-4" />,
      active: isPathActive("/wardrobe")
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
      label: "Favoris",
      path: "/favorites",
      icon: <Heart className="h-4 w-4" />,
      active: isPathActive("/favorites")
    }
  ];
  
  const socialSubItems = [
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
  ];
  
  // Check if any personal sub-item is active
  const isPersonalActive = personalSubItems.some(item => item.active);
  
  // Check if any social sub-item is active
  const isSocialActive = socialSubItems.some(item => item.active);
  
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
      active: isPathActive("/explore")
    },
    {
      id: "personal",
      label: "Mon Univers",
      path: "/wardrobe",
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
      active: isPathActive("/boutiques")
    },
    {
      id: "settings",
      label: "Paramètres",
      path: "/settings",
      icon: <Settings className="h-4 w-4" />,
      active: isPathActive("/settings")
    }
  ];
  
  const handleNavigate = (path: string) => {
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };
  
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
