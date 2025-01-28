import { Home, Cloud, Sparkles, Newspaper, Trophy } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const HomeSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AccordionItem value="home" className="border-none" defaultValue="home">
      <AccordionTrigger className="py-2">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Accueil
        </div>
      </AccordionTrigger>
      <AccordionContent className="!mt-0">
        <div className="flex flex-col gap-1 pl-6">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/",
            })}
            onClick={() => navigate("/")}
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
  );
};