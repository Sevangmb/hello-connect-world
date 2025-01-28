import { 
  Home, 
  Search, 
  Shirt,
  Users,
  User,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
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
    description: "Mon profil et paramètres"
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
              location.pathname === item.path && "text-primary"
            )}
            title={item.description}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};