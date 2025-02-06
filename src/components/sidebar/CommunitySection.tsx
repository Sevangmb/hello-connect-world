import { Users, MessageSquare, Bell, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const CommunitySection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
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
  );
};
