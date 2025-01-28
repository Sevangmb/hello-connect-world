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
  Award,
  Briefcase,
  Image,
  Upload,
  Tag,
  ShoppingBag,
  User,
  TrendingUp,
  Star,
  Hash,
  MapPin,
  Filter,
  List
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
  const [openMenus, setOpenMenus] = useState<string[]>(["home", "wardrobe", "personal", "profile"]);

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
      icon: Search,
      subItems: [
        { id: "search", label: "Recherche", path: "/explore/search", icon: Search },
        { 
          id: "trends", 
          label: "Tendances", 
          path: "/explore/trends", 
          icon: TrendingUp,
          subItems: [
            { id: "popular-outfits", label: "Tenues Populaires", path: "/explore/trends/outfits", icon: Heart },
            { id: "popular-items", label: "Articles Populaires", path: "/explore/trends/items", icon: Star },
            { id: "popular-hashtags", label: "Hashtags Populaires", path: "/explore/trends/hashtags", icon: Hash }
          ]
        },
        {
          id: "shops",
          label: "Boutiques",
          path: "/explore/shops",
          icon: Store,
          subItems: [
            { id: "shops-map", label: "Carte Interactive", path: "/explore/shops/map", icon: MapPin },
            { id: "shops-filters", label: "Filtres de recherche", path: "/explore/shops/search", icon: Filter },
            { id: "shops-list", label: "Liste des Boutiques", path: "/explore/shops/list", icon: List }
          ]
        }
      ]
    },
    {
      id: "personal",
      label: "Mon Univers",
      icon: ShoppingBag,
      subItems: [
        { id: "wardrobe", label: "Ma Garde-Robe", path: "/wardrobe", icon: Shirt },
        { id: "outfits", label: "Mes Tenues", path: "/outfits", icon: Camera },
        { id: "looks", label: "Mes Looks", path: "/looks", icon: Image },
        { id: "suitcases", label: "Mes Valises", path: "/suitcases", icon: Briefcase },
        { id: "favorites", label: "Mes Favoris", path: "/favorites", icon: Heart },
        { id: "add-clothes", label: "Ajouter un Vêtement", path: "/add-clothes", icon: Plus },
        { id: "create-outfit", label: "Créer une Tenue", path: "/create-outfit", icon: Tag },
        { id: "publish-look", label: "Publier un Look", path: "/publish-look", icon: Upload },
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
      id: "profile",
      label: "Mon Profil",
      icon: User,
      subItems: [
        { id: "marketplace", label: "Vide-Dressing", path: "/marketplace", icon: Store },
        { id: "sales", label: "Mes Ventes", path: "/sales-history", icon: History },
        { id: "purchases", label: "Mes Achats", path: "/purchases", icon: ShoppingCart },
        { id: "badges", label: "Mes Badges", path: "/badges", icon: Trophy },
        { id: "settings", label: "Paramètres", path: "/profile", icon: Settings },
        { id: "privacy", label: "Mode privé", path: "/privacy", icon: EyeOff },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-24 h-[calc(100vh-6rem)] w-64 bg-white border-r">
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
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