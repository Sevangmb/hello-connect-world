
import React, { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import MenuCategories from "./MenuCategories";
import AdminMenuSection from "./AdminMenuSection";
import { useModuleMenuEvents } from "./hooks/useModuleMenuEvents";

// Composant de menu principal avec optimisations pour éviter le clignotement
export const ModuleMenu: React.FC = () => {
  const { isUserAdmin } = useModuleMenuEvents();
  const [initialized, setInitialized] = useState(false);
  
  // Optimiser les mises à jour de menu pour éviter le clignotement
  useEffect(() => {
    // Marquer comme initialisé après le premier rendu
    if (!initialized) {
      setInitialized(true);
      // Initialiser le statut admin dans le coordinateur
      if (isUserAdmin) {
        moduleMenuCoordinator.enableAdminAccess();
      }
    }
  }, [isUserAdmin, initialized]);

  // Ajoutons un peu de débogage pour comprendre le problème
  console.log("ModuleMenu: Rendu avec isUserAdmin =", isUserAdmin);
  
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 w-full">
        {/* Menus par catégorie */}
        <MenuCategories />
        
        {/* Menu d'administration - uniquement rendu si admin */}
        <AdminMenuSection isUserAdmin={isUserAdmin} />
      </div>
    </TooltipProvider>
  );
};

export default ModuleMenu;
