
import { 
  Home,
  Search,
  ShoppingBag,
  Users,
  User
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNotifications } from "@/hooks/useNotifications";
import { memo, useMemo, useCallback, useEffect, useState } from "react";
import { useModules } from "@/hooks/useModules";

const NavButton = memo(({ item, isActive, unreadCount, onClick }: any) => (
  <TooltipProvider key={item.path}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "flex flex-col items-center justify-center p-2 transition-colors relative",
            item.isMain ? "w-16 -mt-4" : "w-full",
            isActive
              ? "text-facebook-primary" 
              : "text-gray-500 hover:text-facebook-primary hover:bg-gray-50"
          )}
        >
          {item.isMain ? (
            <div className="bg-facebook-primary text-white p-3 rounded-full shadow-lg -mt-2">
              <item.icon className="h-6 w-6" />
            </div>
          ) : (
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.hasNotifications && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          )}
          <span className={cn(
            "text-xs mt-1",
            item.isMain && "font-medium"
          )}>
            {item.label}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-white text-gray-800 border shadow-md z-50">
        <p>{item.description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
));

export const BottomNav = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useNotifications();
  const { isModuleActive } = useModules();
  const [moduleStatus, setModuleStatus] = useState({});
  
  // Initialiser l'état des modules
  useEffect(() => {
    const checkModules = async () => {
      const status = {
        explore: await isModuleActive('explore'),
        wardrobe: await isModuleActive('wardrobe'),
        community: await isModuleActive('community'),
        profile: await isModuleActive('profile')
      };
      setModuleStatus(status);
    };
    
    checkModules();
  }, [isModuleActive]);

  // Compteur de notifications
  const unreadCount = useMemo(() => 
    notifications?.filter(n => !n.read).length || 0,
    [notifications]
  );

  // Configuration du menu
  const MENU_ITEMS = useMemo(() => [
    {
      label: "Accueil",
      icon: Home,
      path: "/",
      description: "Météo et suggestions",
      isAlwaysVisible: true
    },
    {
      label: "Explorer",
      icon: Search,
      path: "/explore",
      description: "Recherche et tendances",
      moduleKey: "explore"
    },
    {
      label: "Mon Univers",
      icon: ShoppingBag,
      path: "/personal",
      description: "Garde-robe et tenues",
      isMain: true,
      moduleKey: "wardrobe"
    },
    {
      label: "Social",
      icon: Users,
      path: "/friends",
      description: "Amis et groupes",
      moduleKey: "community",
      hasNotifications: true
    },
    {
      label: "Profil",
      icon: User,
      path: "/profile",
      description: "Mon profil et paramètres",
      moduleKey: "profile"
    }
  ], []);

  // Filtrer les éléments du menu
  const filteredMenuItems = useMemo(() => 
    MENU_ITEMS.filter(item => 
      item.isAlwaysVisible || 
      (item.moduleKey && moduleStatus[item.moduleKey])
    ),
    [MENU_ITEMS, moduleStatus]
  );

  // Vérifier si un chemin est actif
  const isActive = useCallback((path) => {
    return path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(path);
  }, [location.pathname]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-lg">
      <div className="flex justify-around items-center relative px-1 pt-1 pb-2">
        {filteredMenuItems.map((item) => (
          <NavButton 
            key={item.path}
            item={item} 
            isActive={isActive(item.path)} 
            unreadCount={unreadCount} 
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      {/* Indicateur de position */}
      <div className="absolute top-0 left-0 w-full flex justify-around">
        {filteredMenuItems.map((item, index) => (
          <div 
            key={`indicator-${index}`}
            className={cn(
              "h-0.5 w-12 rounded-full transition-all duration-300",
              isActive(item.path) ? "bg-facebook-primary" : "bg-transparent"
            )}
          />
        ))}
      </div>
    </nav>
  );
});
