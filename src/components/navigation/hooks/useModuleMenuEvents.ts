
import { useEffect } from "react";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_MENU_EVENTS } from "@/services/coordination/ModuleMenuCoordinator";
import { useToast } from "@/hooks/use-toast";
import { useMenu } from "@/hooks/menu";

/**
 * Custom hook to handle module menu events and refreshes
 */
export const useModuleMenuEvents = () => {
  const { isUserAdmin, refreshMenu } = useMenu();
  const { toast } = useToast();

  useEffect(() => {
    // Écouter les événements de mise à jour de menu et de modules
    // en utilisant un délai pour éviter les rafraîchissements trop fréquents
    let refreshTimeout: NodeJS.Timeout | null = null;
    
    const handleMenuUpdate = () => {
      // Annuler tout timeout existant
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      
      // Planifier un rafraîchissement avec un délai
      refreshTimeout = setTimeout(() => {
        console.log("ModuleMenu: Rafraîchissement du menu suite à un événement");
        refreshMenu();
        refreshTimeout = null;
      }, 300); // Délai pour regrouper les mises à jour rapprochées
    };
    
    const unsubscribeMenuUpdated = eventBus.subscribe(
      MODULE_MENU_EVENTS.MENU_UPDATED, 
      handleMenuUpdate
    );
    
    const unsubscribeModuleStatus = eventBus.subscribe(
      MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, 
      (data) => {
        console.log(`ModuleMenu: Changement de statut du module ${data.moduleCode} détecté`);
        handleMenuUpdate();
        
        // Afficher une notification de changement de statut
        if (data.status === 'inactive') {
          toast({
            title: "Module désactivé",
            description: `Le module ${data.moduleCode} a été désactivé`,
            variant: "default"
          });
        }
      }
    );
    
    const unsubscribeAdminAccess = eventBus.subscribe(
      MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, 
      handleMenuUpdate
    );
    
    const unsubscribeAdminRevoked = eventBus.subscribe(
      MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, 
      handleMenuUpdate
    );
    
    return () => {
      // Nettoyer les abonnements
      unsubscribeMenuUpdated();
      unsubscribeModuleStatus();
      unsubscribeAdminAccess();
      unsubscribeAdminRevoked();
      
      // Annuler tout timeout en attente
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [refreshMenu, toast]);

  return { isUserAdmin, refreshMenu };
};
