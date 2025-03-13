
import React from "react";
import { User } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useModules } from "@/hooks/modules";
import { useEffect, useState } from "react";
import { onModuleStatusChanged } from "@/hooks/modules/events";
import PersonalMenu from "@/components/personal/PersonalMenu";

export const PersonalSection = () => {
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

  // Vérifier si au moins un module personnel est activé
  const hasActivePersonalModules = Object.values(moduleStates).some(isActive => isActive);

  return (
    <AccordionItem value="personal" className="border-none">
      <AccordionTrigger className="py-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Personnel
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {hasActivePersonalModules ? (
          <PersonalMenu />
        ) : (
          <div className="pl-6 text-sm text-muted-foreground">
            Aucun module personnel activé
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default PersonalSection;
