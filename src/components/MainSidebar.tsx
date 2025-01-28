import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Search,
  ShoppingBag,
  Users,
  User,
  Shield,
  Cloud,
  Sparkles,
  Newspaper,
  Trophy,
  Store,
  TrendingUp,
  Heart,
  Star,
  Hash,
  MapPin,
  Filter,
  List,
  Shirt,
  Camera,
  Upload,
  FileText,
  Briefcase,
  ScanLine,
  PlusCircle,
  Pencil,
  Share2,
  MessageSquare,
  Bell,
  UserPlus,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Settings,
  BookOpen,
  Megaphone,
  ChartBar
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MainSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: isAdmin } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        setIsAdmin(isAdmin || false);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <nav className="fixed left-0 top-0 bottom-0 hidden w-64 border-r bg-white pt-16 md:block">
      <ScrollArea className="h-full px-4 py-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="home" className="border-none">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Accueil
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-6">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/weather",
                  })}
                  onClick={() => navigate("/weather")}
                >
                  <Cloud className="h-4 w-4" />
                  Météo du Jour
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/suggestions",
                  })}
                  onClick={() => navigate("/suggestions")}
                >
                  <Sparkles className="h-4 w-4" />
                  Suggestions IA
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/feed",
                  })}
                  onClick={() => navigate("/feed")}
                >
                  <Newspaper className="h-4 w-4" />
                  Fil d'Actualité
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/challenges",
                  })}
                  onClick={() => navigate("/challenges")}
                >
                  <Trophy className="h-4 w-4" />
                  Défis Mode
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="explore" className="border-none">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Explorer
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-6">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/search",
                  })}
                  onClick={() => navigate("/search")}
                >
                  <Search className="h-4 w-4" />
                  Recherche
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/trending/outfits",
                  })}
                  onClick={() => navigate("/trending/outfits")}
                >
                  <Heart className="h-4 w-4" />
                  Tenues Populaires
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/trending/items",
                  })}
                  onClick={() => navigate("/trending/items")}
                >
                  <Star className="h-4 w-4" />
                  Articles Populaires
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/trending/hashtags",
                  })}
                  onClick={() => navigate("/trending/hashtags")}
                >
                  <Hash className="h-4 w-4" />
                  Hashtags Populaires
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/stores/map",
                  })}
                  onClick={() => navigate("/stores/map")}
                >
                  <MapPin className="h-4 w-4" />
                  Carte des Boutiques
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/stores/search",
                  })}
                  onClick={() => navigate("/stores/search")}
                >
                  <Filter className="h-4 w-4" />
                  Filtrer les Boutiques
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/stores/list",
                  })}
                  onClick={() => navigate("/stores/list")}
                >
                  <List className="h-4 w-4" />
                  Liste des Boutiques
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="personal" className="border-none">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Mon Univers
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-6">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/wardrobe",
                  })}
                  onClick={() => navigate("/wardrobe")}
                >
                  <Shirt className="h-4 w-4" />
                  Ma Garde-Robe
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/outfits",
                  })}
                  onClick={() => navigate("/outfits")}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Mes Tenues
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/looks",
                  })}
                  onClick={() => navigate("/looks")}
                >
                  <Camera className="h-4 w-4" />
                  Mes Looks
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/suitcases",
                  })}
                  onClick={() => navigate("/suitcases")}
                >
                  <Briefcase className="h-4 w-4" />
                  Mes Valises
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/favorites",
                  })}
                  onClick={() => navigate("/favorites")}
                >
                  <Heart className="h-4 w-4" />
                  Mes Favoris
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/create-outfit",
                  })}
                  onClick={() => navigate("/create-outfit")}
                >
                  <Pencil className="h-4 w-4" />
                  Créer une Tenue
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/publish-look",
                  })}
                  onClick={() => navigate("/publish-look")}
                >
                  <Share2 className="h-4 w-4" />
                  Publier un Look
                </Button>
                <AccordionItem value="add-clothes" className="border-none">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Ajouter un Vêtement
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-1 pl-6">
                      <Button
                        variant="ghost"
                        className={cn("w-full justify-start gap-2", {
                          "bg-gray-100": location.pathname === "/add-clothes/scan",
                        })}
                        onClick={() => navigate("/add-clothes/scan")}
                      >
                        <ScanLine className="h-4 w-4" />
                        Scanner étiquette
                      </Button>
                      <Button
                        variant="ghost"
                        className={cn("w-full justify-start gap-2", {
                          "bg-gray-100": location.pathname === "/add-clothes/photo",
                        })}
                        onClick={() => navigate("/add-clothes/photo")}
                      >
                        <Camera className="h-4 w-4" />
                        Prendre une Photo
                      </Button>
                      <Button
                        variant="ghost"
                        className={cn("w-full justify-start gap-2", {
                          "bg-gray-100": location.pathname === "/add-clothes/import",
                        })}
                        onClick={() => navigate("/add-clothes/import")}
                      >
                        <Upload className="h-4 w-4" />
                        Importer depuis la Galerie
                      </Button>
                      <Button
                        variant="ghost"
                        className={cn("w-full justify-start gap-2", {
                          "bg-gray-100": location.pathname === "/add-clothes/manual",
                        })}
                        onClick={() => navigate("/add-clothes/manual")}
                      >
                        <FileText className="h-4 w-4" />
                        Saisie Manuelle
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="community" className="border-none">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Communauté
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-6">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/messages",
                  })}
                  onClick={() => navigate("/messages")}
                >
                  <MessageSquare className="h-4 w-4" />
                  Messagerie
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/groups",
                  })}
                  onClick={() => navigate("/groups")}
                >
                  <Users className="h-4 w-4" />
                  Groupes
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/notifications",
                  })}
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="h-4 w-4" />
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/find-friends",
                  })}
                  onClick={() => navigate("/find-friends")}
                >
                  <UserPlus className="h-4 w-4" />
                  Trouver des amis
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {isAdmin && (
            <AccordionItem value="admin" className="border-none">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Administration
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 pl-6">
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", {
                      "bg-gray-100": location.pathname === "/admin/dashboard",
                    })}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Tableau de Bord
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", {
                      "bg-gray-100": location.pathname === "/admin/users",
                    })}
                    onClick={() => navigate("/admin/users")}
                  >
                    <Users className="h-4 w-4" />
                    Utilisateurs
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", {
                      "bg-gray-100": location.pathname === "/admin/shops",
                    })}
                    onClick={() => navigate("/admin/shops")}
                  >
                    <Store className="h-4 w-4" />
                    Boutiques
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", {
                      "bg-gray-100": location.pathname === "/admin/marketplace",
                    })}
                    onClick={() => navigate("/admin/marketplace")}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Vide-Dressing
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", {
                      "bg-gray-100": location.pathname === "/admin/content",
                    })}
                    onClick={() => navigate("/admin/content")}
                  >
                    <BookOpen className="h-4 w-4" />
                    Contenu
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", {
                      "bg-gray-100": location.pathname === "/admin/stats",
                    })}
                    onClick={() => navigate("/admin/stats")}
                  >
                    <ChartBar className="h-4 w-4" />
                    Statistiques
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", {
                      "bg-gray-100": location.pathname === "/admin/marketing",
                    })}
                    onClick={() => navigate("/admin/marketing")}
                  >
                    <Megaphone className="h-4 w-4" />
                    Marketing
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", {
                      "bg-gray-100": location.pathname === "/admin/settings",
                    })}
                    onClick={() => navigate("/admin/settings")}
                  >
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", {
                      "bg-gray-100": location.pathname === "/admin/help",
                    })}
                    onClick={() => navigate("/admin/help")}
                  >
                    <HelpCircle className="h-4 w-4" />
                    Aide & Support
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </ScrollArea>
    </nav>
  );
}
