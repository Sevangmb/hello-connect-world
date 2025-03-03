
import {
  Home,
  Lightbulb,
  Sparkles
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

export const HomeSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive, refreshModules } = useModules();
  const [moduleStates, setModuleStates] = useState({
    suggestions: false,
    ai: false
  });

  // Forcer un rechargement des données des modules au montage
  useEffect(() => {
    const loadModules = async () => {
      console.log("HomeSection: Chargement des modules");
      await refreshModules();
      
      // Vérifier explicitement chaque module et mettre à jour l'état local
      const checkModule = async (code: string) => {
        const isActive = await isModuleActive(code);
        return isActive;
      };
      
      const [suggestionsActive, aiActive] = 
        await Promise.all([
          checkModule('suggestions'),
          checkModule('ai')
        ]);
      
      console.log(`HomeSection: État des modules - suggestions: ${suggestionsActive}, ai: ${aiActive}`);
      
      setModuleStates({
        suggestions: suggestionsActive,
        ai: aiActive
      });
    };
    
    loadModules();
  }, [refreshModules, isModuleActive]);

  return (
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
              "bg-custom-blue text-white": location.pathname === "/",
            })}
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            Tableau de bord
          </Button>
          {moduleStates.suggestions && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/suggestions",
              })}
              onClick={() => navigate("/suggestions")}
            >
              <Lightbulb className="h-4 w-4" />
              Suggestions
            </Button>
          )}
          {moduleStates.ai && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/ai-recommendations",
              })}
              onClick={() => navigate("/ai-recommendations")}
            >
              <Sparkles className="h-4 w-4" />
              Recommandations IA
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
