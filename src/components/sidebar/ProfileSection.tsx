
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

export const ProfileSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive } = useModules();

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
          {isModuleActive('profile') && (
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
          {isModuleActive('notifications') && (
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
