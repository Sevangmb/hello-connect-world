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
    description: "Météo, suggestions et fil d'actualité"
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
    description: "Garde-robe et tenues"
  },
  {
    label: "Communauté",
    icon: Users,
    path: "/community",
    description: "Messages et groupes"
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
      <div className="flex justify-around">
        {MENU_ITEMS.map((item) => (
          <TooltipProvider key={item.path}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center w-full p-2 hover:bg-gray-50 transition-colors",
                    location.pathname === item.path && "text-facebook-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
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