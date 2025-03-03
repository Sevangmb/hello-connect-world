
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
import { useModules } from "@/hooks/modules";

// Composant pour afficher le bouton - mémorisé pour éviter les rendus inutiles
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

// Composant principal mémorisé pour éviter les rendus inutiles
export const BottomNav = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useNotifications();
  const { isModuleActive, refreshModules } = useModules();
  
  // État pour suivre les modules actifs
  const [activeModules, setActiveModules] = useState({
    explore: false,
    wardrobe: false,
    community: false,
    profile: false
  });
  
  // Charger l'état des modules au montage
  useEffect(() => {
    const loadModuleStatus = async () => {
      await refreshModules();
      setActiveModules({
        explore: isModuleActive('explore'),
        wardrobe: isModuleActive('wardrobe'),
        community: isModuleActive('community'),
        profile: isModuleActive('profile')
      });
    };
    
    loadModuleStatus();
  }, [refreshModules, isModuleActive]);
  
  // Compteur de notifications non lues
  const unreadCount = useMemo(() => 
    notifications?.filter(n => !n.read).length || 0,
    [notifications]
  );

  // Configuration des éléments du menu
  const MENU_ITEMS = useMemo(() => [
    {
      label: "Accueil",
      icon: Home,
      path: "/",
      description: "Météo et suggestions",
      isAlwaysVisible: true // Toujours visible
    },
    {
      label: "Explorer",
      icon: Search,
      path: "/explore",
      description: "Recherche et tendances",
      moduleCode: "explore",
      isVisible: activeModules.explore
    },
    {
      label: "Mon Univers",
      icon: ShoppingBag,
      path: "/personal",
      description: "Garde-robe et tenues",
      isMain: true,
      moduleCode: "wardrobe",
      isVisible: activeModules.wardrobe
    },
    {
      label: "Social",
      icon: Users,
      path: "/friends",
      description: "Amis et groupes",
      moduleCode: "community",
      hasNotifications: true,
      isVisible: activeModules.community
    },
    {
      label: "Profil",
      icon: User,
      path: "/profile",
      description: "Mon profil et paramètres",
      moduleCode: "profile",
      isVisible: activeModules.profile
    }
  ], [activeModules]);

  // Filtrer pour n'afficher que les modules actifs ou toujours visibles
  const visibleMenuItems = useMemo(() => 
    MENU_ITEMS.filter(item => item.isAlwaysVisible || item.isVisible),
    [MENU_ITEMS]
  );

  // Déterminer si un élément est actif
  const isItemActive = useCallback((itemPath: string) => {
    return itemPath === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(itemPath);
  }, [location.pathname]);

  // Générer les boutons de navigation de manière optimisée
  const navElements = useMemo(() => {
    return visibleMenuItems.map(item => {
      const isActive = isItemActive(item.path);
      
      // Créer une fonction de clic avec capture de l'élément spécifique
      const handleClick = () => {
        navigate(item.path);
      };

      return (
        <NavButton 
          key={`btn-${item.path}`}
          item={item} 
          isActive={isActive} 
          unreadCount={unreadCount} 
          onClick={handleClick}
        />
      );
    });
  }, [visibleMenuItems, isItemActive, unreadCount, navigate]);

  // Créer un tableau d'indicateurs actifs pour l'affichage des traits en haut
  const activeIndicators = useMemo(() => 
    visibleMenuItems.map(item => isItemActive(item.path)),
    [visibleMenuItems, isItemActive]
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-lg">
      <div className="flex justify-around items-center relative px-1 pt-1 pb-2">
        {navElements}
      </div>

      {/* Indicateur de position (petit trait) */}
      <div className="absolute top-0 left-0 w-full flex justify-around">
        {activeIndicators.map((isActive, index) => (
          <div 
            key={`indicator-${index}`}
            className={cn(
              "h-0.5 w-12 rounded-full transition-all duration-300",
              isActive ? "bg-facebook-primary" : "bg-transparent"
            )}
          />
        ))}
      </div>
    </nav>
  );
});
