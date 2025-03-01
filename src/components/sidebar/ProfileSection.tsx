
import {
  User,
  Settings,
  Bell,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useModules } from "@/hooks/useModules";
import { useEffect, useState } from "react";

export const ProfileSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive, refreshModules } = useModules();
  const [moduleStates, setModuleStates] = useState({
    profile: false,
    notifications: false
  });

  // Forcer un rechargement des données des modules au montage
  useEffect(() => {
    const loadModules = async () => {
      console.log("ProfileSection: Chargement des modules");
      await refreshModules();
      
      // Vérifier explicitement chaque module
      const profileActive = isModuleActive('profile');
      const notificationsActive = isModuleActive('notifications');
      
      console.log(`ProfileSection: États des modules - profile: ${profileActive}, notifications: ${notificationsActive}`);
      
      setModuleStates({
        profile: profileActive,
        notifications: notificationsActive
      });
    };
    
    loadModules();
  }, [refreshModules, isModuleActive]);

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
          {moduleStates.profile && (
            <>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2", {
                  "bg-custom-blue text-white": location.pathname === "/profile",
                })}
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4" />
                Mon Profil
              </Button>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2", {
                  "bg-custom-blue text-white": location.pathname === "/profile/settings",
                })}
                onClick={() => navigate("/profile/settings")}
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Button>
            </>
          )}
          {moduleStates.notifications && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/notifications",
              })}
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
