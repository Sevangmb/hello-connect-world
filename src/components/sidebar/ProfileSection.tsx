
import { User, UserCheck, Settings, ShoppingCart, HelpCircle, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.clear();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous déconnecter",
      });
    }
  };

  return (
    <AccordionItem value="profile" className="border-none">
      <AccordionTrigger className="py-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profil
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-1 pl-6">
          <Button
            variant="ghost" data-testid="profile-link"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/profile",
            })}
            onClick={() => navigate("/profile")}
          >
            <UserCheck className="h-4 w-4" />
            Mon Profil
          </Button>
          <Button
            variant="ghost" data-testid="profile-settings-link"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/profile/settings",
            })}
            onClick={() => navigate("/profile/settings")}
          >
            <Settings className="h-4 w-4" />
            Paramètres
          </Button>
          <Button
            variant="ghost" data-testid="marketplace-link"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/marketplace",
            })}
            onClick={() => navigate("/marketplace")}
          >
            <ShoppingCart className="h-4 w-4" />
            Vide-Dressing
          </Button>
          <Button
            variant="ghost" data-testid="help-link"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/help",
            })}
            onClick={() => navigate("/help")}
          >
            <HelpCircle className="h-4 w-4" />
            Aide & Support
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2")}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
