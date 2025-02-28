
import {
  Shield,
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  BookOpen,
  ChartBar,
  Megaphone,
  Settings,
  HelpCircle,
  Package,
  Boxes,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useModules } from "@/hooks/modules";
import { useEffect } from "react";

export const AdminSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive } = useModules();

  // Vérifier que le module admin est actif au chargement
  useEffect(() => {
    const checkAdminModule = async () => {
      const isActive = await isModuleActive('admin');
      if (!isActive) {
        console.warn('Le module Admin doit être actif pour cette section');
      }
    };
    
    checkAdminModule();
  }, [isModuleActive]);

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
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
              "bg-custom-blue text-white": location.pathname === "/admin/dashboard",
            })}
            onClick={handleNavigation("/admin/dashboard")}
          >
            <LayoutDashboard className="h-4 w-4" />
            Tableau de Bord
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/users",
            })}
            onClick={handleNavigation("/admin/users")}
          >
            <Users className="h-4 w-4" />
            Utilisateurs
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/shops",
            })}
            onClick={handleNavigation("/admin/shops")}
          >
            <Store className="h-4 w-4" />
            Boutiques
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/orders",
            })}
            onClick={handleNavigation("/admin/orders")}
          >
            <Package className="h-4 w-4" />
            Commandes
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/marketplace",
            })}
            onClick={handleNavigation("/admin/marketplace")}
          >
            <ShoppingBag className="h-4 w-4" />
            Vide-Dressing
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/content",
            })}
            onClick={handleNavigation("/admin/content")}
          >
            <BookOpen className="h-4 w-4" />
            Contenu
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/stats",
            })}
            onClick={handleNavigation("/admin/stats")}
          >
            <ChartBar className="h-4 w-4" />
            Statistiques
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/marketing",
            })}
            onClick={handleNavigation("/admin/marketing")}
          >
            <Megaphone className="h-4 w-4" />
            Marketing
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/modules",
            })}
            onClick={handleNavigation("/admin/modules")}
          >
            <Boxes className="h-4 w-4" />
            Modules
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/settings",
            })}
            onClick={handleNavigation("/admin/settings")}
          >
            <Settings className="h-4 w-4" />
            Paramètres
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/help",
            })}
            onClick={handleNavigation("/admin/help")}
          >
            <HelpCircle className="h-4 w-4" />
            Aide & Support
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
