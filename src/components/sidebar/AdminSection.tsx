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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const AdminSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
            onClick={() => navigate("/admin/dashboard")}
          >
            <LayoutDashboard className="h-4 w-4" />
            Tableau de Bord
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/users",
            })}
            onClick={() => navigate("/admin/users")}
          >
            <Users className="h-4 w-4" />
            Utilisateurs
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/shops",
            })}
            onClick={() => navigate("/admin/shops")}
          >
            <Store className="h-4 w-4" />
            Boutiques
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/marketplace",
            })}
            onClick={() => navigate("/admin/marketplace")}
          >
            <ShoppingBag className="h-4 w-4" />
            Vide-Dressing
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/content",
            })}
            onClick={() => navigate("/admin/content")}
          >
            <BookOpen className="h-4 w-4" />
            Contenu
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/stats",
            })}
            onClick={() => navigate("/admin/stats")}
          >
            <ChartBar className="h-4 w-4" />
            Statistiques
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/marketing",
            })}
            onClick={() => navigate("/admin/marketing")}
          >
            <Megaphone className="h-4 w-4" />
            Marketing
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/settings",
            })}
            onClick={() => navigate("/admin/settings")}
          >
            <Settings className="h-4 w-4" />
            Paramètres
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-custom-blue text-white": location.pathname === "/admin/help",
            })}
            onClick={() => navigate("/admin/help")}
          >
            <HelpCircle className="h-4 w-4" />
            Aide & Support
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
