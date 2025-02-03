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
    description: "Recherche et tendances"
  },
  {
    label: "Mon Univers",
    icon: ShoppingBag,
    path: "/personal",
    description: "Garde-robe et tenues",
    isMain: true
  },
  {
    label: "Social",
    icon: Users,
    path: "/friends",
    description: "Amis et groupes"
  },
  {
    label: "Profil",
    icon: User,
    path: "/profile",
    description: "Mon profil et paramètres"
  }
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around items-center relative">
        {MENU_ITEMS.map((item) => (
          <TooltipProvider key={item.path}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 transition-colors relative",
                    item.isMain ? "w-16 -mt-4" : "w-full",
                    (item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path))
                      ? "text-facebook-primary" 
                      : "text-gray-500 hover:text-facebook-primary hover:bg-gray-50"
                  )}
                >
                  {item.isMain ? (
                    <div className="bg-facebook-primary text-white p-3 rounded-full shadow-lg -mt-2">
                      <item.icon className="h-6 w-6" />
                    </div>
                  ) : (
                    <item.icon className="h-5 w-5" />
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
        ))}
      </div>
    </nav>
  );
};