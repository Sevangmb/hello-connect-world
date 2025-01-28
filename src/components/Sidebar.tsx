import { 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Shirt,
  UserCircle,
  Trophy,
  MapPin,
  Search
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const menuItems = [
  { 
    icon: Home, 
    label: "Accueil", 
    path: "/",
    description: "Fil d'actualité et posts"
  },
  { 
    icon: Search, 
    label: "Explorer", 
    path: "/explore",
    description: "Recherche et tendances"
  },
  { 
    icon: Shirt, 
    label: "Perso", 
    path: "/personal",
    description: "Garde-robe et tenues"
  },
  { 
    icon: Users, 
    label: "Communauté", 
    path: "/community",
    description: "Messages et groupes"
  },
  { 
    icon: UserCircle, 
    label: "Profil", 
    path: "/profile",
    description: "Paramètres et options"
  }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Déconnexion réussie");
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      
      navigate("/auth");
    } catch (error: any) {
      console.error("Erreur de déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-24 h-[calc(100vh-6rem)] w-64 bg-white border-r">
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors group hover:bg-gray-100",
                location.pathname === item.path 
                  ? "text-facebook-primary bg-blue-50" 
                  : "text-gray-700"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                location.pathname === item.path 
                  ? "text-facebook-primary" 
                  : "text-gray-500 group-hover:text-facebook-primary"
              )} />
              <div className="flex-1 text-left">
                <p className="font-medium">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-2 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors group"
        >
          <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-500" />
          <span className="font-medium text-gray-700 group-hover:text-red-500">
            Se déconnecter
          </span>
        </button>
      </div>
    </aside>
  );
};