
import { useEffect, useCallback } from "react";
import { eventBus, EventCallback } from "@/core/event-bus/EventBus";
import { MODULE_MENU_EVENTS } from "@/services/coordination/ModuleMenuCoordinator";
import { useToast } from "@/hooks/use-toast";
import { useMenu } from "@/hooks/menu";

/**
 * Hook pour gérer les événements liés au menu des modules
 * Utilise le principe d'inversion de dépendance en dépendant d'abstractions (eventBus)
 */
export const useModuleMenuEvents = () => {
  const { isUserAdmin, refreshMenu } = useMenu();
  const { toast } = useToast();

  // Fonction de rafraîchissement avec débounce intégré
  const debouncedRefresh = useCallback(() => {
    let timeout: NodeJS.Timeout | null = null;
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(() => {
        console.log("ModuleMenu: Rafraîchissement du menu suite à un événement");
        refreshMenu();
        timeout = null;
      }, 300);
    };
  }, [refreshMenu]);

  // S'abonner aux événements du menu et des modules
  useEffect(() => {
    // Utiliser un objet pour stocker les abonnements
    const subscriptions = new Map();
    const refresh = debouncedRefresh();
    
    // S'abonner aux événements avec une fonction commune
    const subscribeToEvent = (eventName: string, handler: EventCallback<any>) => {
      const unsubscribe = eventBus.subscribe(eventName, handler);
      subscriptions.set(eventName, unsubscribe);
      return unsubscribe;
    };
    
    // Événement: Menu mis à jour
    subscribeToEvent(MODULE_MENU_EVENTS.MENU_UPDATED, () => {
      refresh();
    });
    
    // Événement: Statut de module changé
    subscribeToEvent(MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, (data) => {
      console.log(`ModuleMenu: Changement de statut du module ${data.moduleCode} détecté`);
      refresh();
      
      // Afficher une notification si le module a été désactivé
      if (data.status === 'inactive') {
        toast({
          title: "Module désactivé",
          description: `Le module ${data.moduleCode} a été désactivé`,
          variant: "default"
        });
      }
    });
    
    // Événement: Accès admin accordé
    subscribeToEvent(MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, () => {
      refresh();
    });
    
    // Événement: Accès admin révoqué
    subscribeToEvent(MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, () => {
      refresh();
    });
    
    // Nettoyage à la désinscription du composant
    return () => {
      // Désabonner tous les événements
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }, [debouncedRefresh, toast]);

  return { isUserAdmin, refreshMenu };
};
