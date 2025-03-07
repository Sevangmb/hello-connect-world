
import { useEffect, useCallback, useRef } from "react";
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
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction de rafraîchissement avec debounce intégré
  const debouncedRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    
    refreshTimerRef.current = setTimeout(() => {
      console.log("ModuleMenu: Rafraîchissement du menu suite à un événement");
      refreshMenu();
      refreshTimerRef.current = null;
    }, 300);
  }, [refreshMenu]);

  // S'abonner aux événements du menu et des modules
  useEffect(() => {
    // Utiliser un objet pour stocker les abonnements
    const subscriptions = new Map();
    
    // S'abonner aux événements avec une fonction commune
    const subscribeToEvent = (eventName: string, handler: EventCallback<any>) => {
      const unsubscribe = eventBus.subscribe(eventName, handler);
      subscriptions.set(eventName, unsubscribe);
      return unsubscribe;
    };
    
    // Événement: Menu mis à jour
    subscribeToEvent(MODULE_MENU_EVENTS.MENU_UPDATED, () => {
      console.log("useModuleMenuEvents: Événement MENU_UPDATED reçu");
      debouncedRefresh();
    });
    
    // Événement: Statut de module changé
    subscribeToEvent(MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, (data) => {
      console.log(`useModuleMenuEvents: Changement de statut du module ${data.moduleCode} détecté`);
      debouncedRefresh();
      
      // Afficher une notification si le module a été désactivé
      if (data.status === 'inactive') {
        toast({
          title: "Module désactivé",
          description: `Le module ${data.moduleCode} a été désactivé`,
          variant: "default"
        });
      } else if (data.status === 'active') {
        toast({
          title: "Module activé",
          description: `Le module ${data.moduleCode} est maintenant actif`,
          variant: "default"
        });
      }
    });
    
    // Événement: Accès admin accordé
    subscribeToEvent(MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, () => {
      console.log("useModuleMenuEvents: Événement ADMIN_ACCESS_GRANTED reçu");
      debouncedRefresh();
      
      toast({
        title: "Accès administrateur",
        description: "Vous avez maintenant accès aux fonctionnalités d'administration",
        variant: "default"
      });
    });
    
    // Événement: Accès admin révoqué
    subscribeToEvent(MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, () => {
      console.log("useModuleMenuEvents: Événement ADMIN_ACCESS_REVOKED reçu");
      debouncedRefresh();
    });
    
    // Nettoyage à la désinscription du composant
    return () => {
      // Annuler tout timer en cours
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      
      // Désabonner tous les événements
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }, [debouncedRefresh, toast]);

  return { 
    isUserAdmin, 
    refreshMenu 
  };
};
