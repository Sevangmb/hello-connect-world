
import { 
  Home,
  Search,
  ShoppingBag,
  Users,
  User,
  Bell
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
    moduleCode: "community"
  },
  {
    label: "Profil",
    icon: User,
    path: "/profile",
    description: "Mon profil et paramètres",
    moduleCode: "profile"
  }
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useNotifications();
  
  // Compteur de notifications non lues
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  // Fonction pour générer un bouton de navigation
  const renderNavButton = (item: typeof MENU_ITEMS[0]) => {
    const isActive = item.path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(item.path);
    
    // Si c'est le bouton Social, on affiche aussi le badge des notifications
    const isNotifications = item.path === "/friends";
      
    const button = (
      <TooltipProvider key={item.path}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate(item.path)}
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
                  {isNotifications && unreadCount > 0 && (
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
          <TooltipContent>
            <p>{item.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    
    // Si l'élément a un moduleCode, on l'enveloppe dans un ModuleGuard
    if (item.moduleCode) {
      return (
        <ModuleGuard key={item.path} moduleCode={item.moduleCode}>
          {button}
        </ModuleGuard>
      );
    }
    
    // Sinon, on retourne juste le bouton
    return button;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-lg">
      <div className="flex justify-around items-center relative px-1 pt-1 pb-2">
        {MENU_ITEMS.map(renderNavButton)}
      </div>

      {/* Indicateur de position (petit trait) */}
      <div className="absolute top-0 left-0 w-full flex justify-around">
        {MENU_ITEMS.map((item, index) => {
          const isActive = item.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.path);
          
          return (
            <div 
              key={`indicator-${index}`}
              className={cn(
                "h-0.5 w-12 rounded-full transition-all duration-300",
                isActive ? "bg-facebook-primary" : "bg-transparent"
              )}
            />
          );
        })}
      </div>
    </nav>
  );
};
