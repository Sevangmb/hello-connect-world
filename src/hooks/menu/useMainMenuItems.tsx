
import { useMemo } from 'react';
import { 
  Home, Search, User, ShoppingBag, 
  Shirt, Layers, Briefcase, Heart, Users,
  MessageSquare, Bell, Settings, Trophy
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  active?: boolean;
}

export interface MenuSection {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  active?: boolean;
  children?: MenuItem[];
}

/**
 * Shared hook to determine if a path is active
 */
export const usePathActive = (currentPath: string) => {
  return useMemo(() => {
    // Function to check if a path is active
    const isPathActive = (path: string): boolean => {
      // Exact match for home
      if (path === '/' && currentPath === '/') return true;
      
      // Special case for personal section
      if (currentPath === '/personal' && (
        path === '/wardrobe' || 
        path === '/outfits' || 
        path === '/wardrobe/suitcases' ||
        path === '/favorites' ||
        path === '/profile'
      )) {
        return true;
      }
      
      // For other routes, check if current path starts with the given path
      if (path !== '/') {
        return currentPath === path || 
              currentPath.startsWith(`${path}/`);
      }
      
      return false;
    };

    return { isPathActive };
  }, [currentPath]);
};

/**
 * Hook to get consistent menu items structure
 */
export const useMainMenuItems = (currentPath: string) => {
  const { isPathActive } = usePathActive(currentPath);
  
  // Define personal sub-items
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
  ], [currentPath, isPathActive]);
  
  // Define social sub-items
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
  ], [currentPath, isPathActive]);
  
  // Define explore sub-items
  const exploreSubItems = useMemo(() => [
    {
      id: "publications",
      label: "Publications",
      path: "/explore/publications",
      icon: <Search className="h-4 w-4" />,
      active: isPathActive("/explore/publications")
    },
    {
      id: "challenges",
      label: "Défis",
      path: "/social/challenges",
      icon: <Trophy className="h-4 w-4" />,
      active: isPathActive("/social/challenges")
    }
  ], [isPathActive]);
  
  // Check if categories are active
  const isPersonalActive = useMemo(() => 
    personalSubItems.some(item => item.active) || currentPath === '/personal',
  [personalSubItems, currentPath]);
  
  const isSocialActive = useMemo(() => 
    socialSubItems.some(item => item.active) || currentPath.startsWith('/social'),
  [socialSubItems, currentPath]);

  const isExploreActive = useMemo(() => 
    exploreSubItems.some(item => item.active) || isPathActive("/explore"),
  [exploreSubItems, isPathActive]);

  // Full menu structure
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
      active: isExploreActive,
      children: exploreSubItems
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
  ], [currentPath, isPathActive, isPersonalActive, isSocialActive, isExploreActive, personalSubItems, socialSubItems, exploreSubItems]);

  return { menuStructure, personalSubItems, socialSubItems, exploreSubItems };
};
