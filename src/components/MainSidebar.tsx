import { 
  Home, 
  Search,
  Shirt,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Store,
  History,
  ShoppingCart,
  Plus,
  Trophy,
  Eye,
  EyeOff,
  Heart,
  Camera,
  Cloud,
  Sparkles,
  Newspaper,
  Award
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "./ui/button";

const MainSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [openMenus, setOpenMenus] = useState<string[]>(["home", "wardrobe"]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

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

  const menuItems = [
    {
      id: "home",
      label: "Accueil",
      icon: Home,
      subItems: [
        { id: "weather", label: "Météo", path: "/", icon: Cloud },
        { id: "ai", label: "Suggestions IA", path: "/suggestions", icon: Sparkles },
        { id: "feed", label: "Fil d'actualité", path: "/feed", icon: Newspaper },
        { id: "challenges", label: "Défis", path: "/challenges", icon: Award },
      ]
    },
    {
      id: "explore",
      label: "Explorer",
      path: "/explore",
      icon: Search,
      description: "Recherche et tendances"
    },
    {
      id: "wardrobe",
      label: "Garde-Robe",
      icon: Shirt,
      subItems: [
        { id: "wardrobe", label: "Ma Garde-Robe", path: "/wardrobe", icon: Shirt },
        { id: "outfits", label: "Mes Tenues", path: "/outfits", icon: Camera },
        { id: "looks", label: "Mes Looks", path: "/looks", icon: Camera },
        { id: "favorites", label: "Mes Favoris", path: "/favorites", icon: Heart },
      ]
    },
    {
      id: "community",
      label: "Communauté",
      icon: Users,
      subItems: [
        { id: "messages", label: "Messages", path: "/messages", icon: MessageSquare },
        { id: "groups", label: "Groupes", path: "/groups", icon: Users },
      ]
    },
    {
      id: "marketplace",
      label: "Vide-Dressing",
      icon: Store,
      subItems: [
        { id: "marketplace", label: "Articles en vente", path: "/marketplace", icon: Store },
        { id: "add-item", label: "Ajouter un article", path: "/add-item", icon: Plus },
        { id: "sales-history", label: "Historique des ventes", path: "/sales-history", icon: History },
        { id: "purchases", label: "Mes Achats", path: "/purchases", icon: ShoppingCart },
      ]
    },
    {
      id: "achievements",
      label: "Récompenses",
      icon: Trophy,
      subItems: [
        { id: "badges", label: "Mes Badges", path: "/badges", icon: Trophy },
      ]
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      subItems: [
        { id: "profile", label: "Mon Profil", path: "/profile", icon: Settings },
        { id: "privacy", label: "Mode privé", path: "/privacy", icon: EyeOff },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-24 h-[calc(100vh-6rem)] w-64 bg-white border-r">
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            item.subItems ? (
              <Collapsible
                key={item.id}
                open={openMenus.includes(item.id)}
                onOpenChange={() => toggleMenu(item.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {openMenus.includes(item.id) ? (
                      <Eye className="h-4 w-4 transition-transform" />
                    ) : (
                      <EyeOff className="h-4 w-4 transition-transform" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Button
                      key={subItem.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2",
                        location.pathname === subItem.path && "bg-blue-50 text-facebook-primary"
                      )}
                      onClick={() => navigate(subItem.path)}
                    >
                      <subItem.icon className="h-4 w-4" />
                      {subItem.label}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  location.pathname === item.path && "bg-blue-50 text-facebook-primary"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <div className="flex-1 text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </Button>
            )
          ))}
        </div>
      </nav>

      <div className="p-2 border-t">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </aside>
  );
};

export default MainSidebar;