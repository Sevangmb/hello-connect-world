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

export const ProfileSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
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
            variant="ghost" data-testid="help-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="marketplace-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-settings-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment.
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/profile",
            })}
            onClick={() => { if (process.env.NODE_ENV === "development") { console.log("Navigating to /profile"); } navigate("/profile"); }}
          >
            <UserCheck className="h-4 w-4" />
            Mon Profil
          </Button>
          <Button
            variant="ghost" data-testid="help-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="marketplace-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-settings-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment.
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/profile/settings",
            })}
            onClick={() => { if (process.env.NODE_ENV === "development") { console.log("Navigating to /profile/settings"); } navigate("/profile/settings"); }}
          >
            <Settings className="h-4 w-4" />
            Paramètres
          </Button>
          <Button
            variant="ghost" data-testid="help-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="marketplace-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-settings-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment.
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/marketplace",
            })}
            onClick={() => { if (process.env.NODE_ENV === "development") { console.log("Navigating to /marketplace"); } navigate("/marketplace"); }}
          >
            <ShoppingCart className="h-4 w-4" />
            Vide-Dressing
          </Button>
          <Button
            variant="ghost" data-testid="help-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="marketplace-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-settings-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment.
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/help",
            })}
            onClick={() => { if (process.env.NODE_ENV === "development") { console.log("Navigating to /help"); } navigate("/help"); }}
          >
            <HelpCircle className="h-4 w-4" />
            Aide & Support
          </Button>
          <Button
            variant="ghost" data-testid="help-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="marketplace-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-settings-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment. data-testid="profile-link" // Navigation according to route definitions in src/main.tsx. Remember to manually test each menu link in the development environment.
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
