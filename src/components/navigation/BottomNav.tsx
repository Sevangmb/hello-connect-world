
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
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { useNotifications } from "@/hooks/useNotifications";
import { memo, useMemo } from "react";

// Menu items configuration
const MENU_ITEMS = [
  {
    label: "Accueil",
    icon: Home,
    path: "/",
    description: "Météo et suggestions"
  },
  {
    label: "Explorer",
    icon: Search,
    path: "/explore",
    description: "Recherche et tendances",
    moduleCode: "explore"
  },
  {
    label: "Mon Univers",
    icon: ShoppingBag,
    path: "/personal",
    description: "Garde-robe et tenues",
    isMain: true,
    moduleCode: "wardrobe"
  },
  {
    label: "Social",
    icon: Users,
    path: "/friends",
    description: "Amis et groupes",
    moduleCode: "community",
    hasNotifications: true
  },
  {
    label: "Profil",
    icon: User,
    path: "/profile",
    description: "Mon profil et paramètres",
    moduleCode: "profile"
  }
];

// Composant pour afficher le bouton sans module - mémorisé pour éviter les rendus inutiles
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

// Fallback pour les modules désactivés - mémorisé pour éviter les rendus inutiles
const DisabledNavButton = memo(({ item }: any) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex flex-col items-center justify-center p-2 transition-colors relative opacity-40",
            item.isMain ? "w-16 -mt-4" : "w-full",
            "text-gray-400"
          )}
        >
          {item.isMain ? (
            <div className="bg-gray-400 text-white p-3 rounded-full shadow-lg -mt-2">
              <item.icon className="h-6 w-6" />
            </div>
          ) : (
            <div className="relative">
              <item.icon className="h-5 w-5" />
            </div>
          )}
          <span className={cn("text-xs mt-1")}>
            {item.label}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-white text-gray-800 border shadow-md z-50">
        <p>Module désactivé</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
));

// Mémoiser les boutons à l'avance pour chaque élément du menu
const renderNavButtons = (
  navigate: ReturnType<typeof useNavigate>,
  location: ReturnType<typeof useLocation>,
  unreadCount: number
) => {
  return MENU_ITEMS.map(item => {
    const isActive = item.path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(item.path);
    
    const handleClick = () => navigate(item.path);
    
    return {
      item,
      button: (
        <NavButton 
          key={`btn-${item.path}`}
          item={item} 
          isActive={isActive} 
          unreadCount={unreadCount} 
          onClick={handleClick}
        />
      ),
      fallback: (
        <DisabledNavButton key={`disabled-${item.path}`} item={item} />
      )
    };
  });
};

// Composant principal mémorisé pour éviter les rendus inutiles
export const BottomNav = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useNotifications();
  
  // Compteur de notifications non lues
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  // Pré-calculer tous les boutons et fallbacks
  const navButtons = useMemo(() => 
    renderNavButtons(navigate, location, unreadCount),
    [navigate, location, unreadCount]
  );

  // Créer un tableau d'indicateurs actifs pour l'affichage des traits en haut
  const activeIndicators = useMemo(() => 
    MENU_ITEMS.map(item => 
      item.path === "/" 
        ? location.pathname === "/" 
        : location.pathname.startsWith(item.path)
    ),
    [location.pathname]
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-lg">
      <div className="flex justify-around items-center relative px-1 pt-1 pb-2">
        {navButtons.map(({ item, button, fallback }, index) => 
          item.moduleCode ? (
            <ModuleGuard 
              key={`guard-${item.path}`} 
              moduleCode={item.moduleCode}
              fallback={fallback}
            >
              {button}
            </ModuleGuard>
          ) : button
        )}
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
