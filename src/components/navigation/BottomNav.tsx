import { 
  Home, 
  Search, 
  User, 
  Users,
  Shirt,
  Cloud,
  MapPin,
  MessageSquare,
  Bell,
  Settings
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Accueil",
    icon: Home,
    path: "/",
    description: "Fil d'actualité et suggestions"
  },
  {
    label: "Explorer",
    icon: Search,
    path: "/explore",
    description: "Recherche et tendances"
  },
  {
    label: "Perso",
    icon: Shirt,
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
    description: "Paramètres et options"
  }
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
      <div className="flex items-center justify-around">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center w-full p-2 hover:bg-gray-50 transition-colors",
              location.pathname === item.path && "text-facebook-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};