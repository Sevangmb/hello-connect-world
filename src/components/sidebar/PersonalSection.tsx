
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Calendar,
  Briefcase,
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
import { useEffect, useState } from "react";
import { onModuleStatusChanged } from "@/hooks/modules/events";

export const PersonalSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive, refreshModules } = useModules();
  
  // États locaux pour surveiller les changements de modules
  const [moduleStates, setModuleStates] = useState({
    wardrobe: false,
    outfits: false,
    suitcases: false,
    shopping: false,
    favorites: false,
    calendar: false
  });

  // Mettre à jour les états locaux des modules
  const updateModuleStates = () => {
    setModuleStates({
      wardrobe: isModuleActive('wardrobe'),
      outfits: isModuleActive('outfits'),
      suitcases: isModuleActive('suitcases'),
      shopping: isModuleActive('shopping'),
      favorites: isModuleActive('favorites'),
      calendar: isModuleActive('calendar')
    });
  };

  // Effet pour s'abonner aux changements de statut des modules
  useEffect(() => {
    // Mettre à jour lors du montage
    updateModuleStates();
    
    // Forcer un refresh des modules au montage pour s'assurer d'avoir les données les plus récentes
    refreshModules().then(() => {
      updateModuleStates();
    });
    
    // S'abonner aux changements
    const cleanup = onModuleStatusChanged(() => {
      console.log("Module status changed, updating sidebar...");
      updateModuleStates();
    });
    
    return cleanup;
  }, [isModuleActive, refreshModules]);

  return (
    <AccordionItem value="personal" className="border-none">
      <AccordionTrigger className="py-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Personnel
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-1 pl-6">
          {moduleStates.wardrobe && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/clothes",
              })}
              onClick={() => navigate("/clothes")}
            >
              <ShoppingBag className="h-4 w-4" />
              Garde-robe
            </Button>
          )}
          {moduleStates.outfits && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/outfits",
              })}
              onClick={() => navigate("/outfits")}
            >
              <ShoppingBag className="h-4 w-4" />
              Tenues
            </Button>
          )}
          {moduleStates.suitcases && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/suitcases",
              })}
              onClick={() => navigate("/suitcases")}
            >
              <Briefcase className="h-4 w-4" />
              Valises
            </Button>
          )}
          {moduleStates.shopping && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/cart",
              })}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-4 w-4" />
              Panier
            </Button>
          )}
          {moduleStates.favorites && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/favorites",
              })}
              onClick={() => navigate("/favorites")}
            >
              <Heart className="h-4 w-4" />
              Favoris
            </Button>
          )}
          {moduleStates.calendar && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/calendar",
              })}
              onClick={() => navigate("/calendar")}
            >
              <Calendar className="h-4 w-4" />
              Calendrier
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
