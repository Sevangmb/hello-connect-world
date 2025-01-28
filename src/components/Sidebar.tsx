import { 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Shirt,
  UserCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  { 
    icon: Home, 
    label: "Accueil", 
    path: "/",
    description: "Fil d'actualité et posts"
  },
  { 
    icon: Users, 
    label: "Amis", 
    path: "/friends",
    description: "Gérer vos amis"
  },
  { 
    icon: MessageSquare, 
    label: "Messages", 
    path: "/messages",
    description: "Conversations privées et groupes"
  },
  { 
    icon: Shirt, 
    label: "Vêtements", 
    path: "/clothes",
    description: "Gérer votre garde-robe"
  },
  { 
    icon: UserCircle, 
    label: "Profil", 
    path: "/profile",
    description: "Modifier votre profil"
  },
  { 
    icon: Settings, 
    label: "Paramètres", 
    path: "/settings",
    description: "Configurer votre compte"
  }
];

export const Sidebar = () => {
  const navigate = useNavigate();
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
    <aside className="hidden md:flex flex-col fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white border-r">
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <item.icon className="h-5 w-5 text-gray-500 group-hover:text-facebook-primary" />
              <div className="flex-1">
                <p className="font-medium text-gray-700 group-hover:text-facebook-primary">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">
                  {item.description}
                </p>
              </div>
            </a>
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