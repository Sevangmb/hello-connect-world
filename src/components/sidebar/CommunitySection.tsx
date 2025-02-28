
import {
  Users,
  MessageSquare,
  UserPlus,
  FolderOpen,
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

export const CommunitySection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive } = useModules();

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
          {isModuleActive('social_feed') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/feed",
              })}
              onClick={() => navigate("/feed")}
            >
              <FolderOpen className="h-4 w-4" />
              Fil d'actualité
            </Button>
          )}
          {isModuleActive('friends') && (
            <>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2", {
                  "bg-custom-blue text-white": location.pathname === "/friends",
                })}
                onClick={() => navigate("/friends")}
              >
                <Users className="h-4 w-4" />
                Amis
              </Button>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2", {
                  "bg-custom-blue text-white": location.pathname === "/find-friends",
                })}
                onClick={() => navigate("/find-friends")}
              >
                <UserPlus className="h-4 w-4" />
                Trouver des amis
              </Button>
            </>
          )}
          {isModuleActive('messaging') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/messages",
              })}
              onClick={() => navigate("/messages")}
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </Button>
          )}
          {isModuleActive('groups') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/groups",
              })}
              onClick={() => navigate("/groups")}
            >
              <Users className="h-4 w-4" />
              Groupes
            </Button>
          )}
          {isModuleActive('challenges') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/challenges",
              })}
              onClick={() => navigate("/challenges")}
            >
              <FolderOpen className="h-4 w-4" />
              Défis
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
