
import { useEffect, useCallback, useRef } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { useMenu } from "@/hooks/menu";

/**
 * Hook pour gérer les événements liés au menu des modules
 * Utilise le service d'événements centralisé pour suivre le principe SRP
 */
export const useModuleMenuEvents = () => {
  const { isUserAdmin, refreshMenu } = useMenu();
  const { toast } = useToast();
  const { subscribe, EVENT_TYPES } = useEvents();
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
    // Événement: Menu mis à jour
    const unsubscribeMenuUpdated = subscribe(EVENT_TYPES.MENU_UPDATED, () => {
      console.log("useModuleMenuEvents: Événement MENU_UPDATED reçu");
      debouncedRefresh();
    });
    
    // Événement: Statut de module changé
    const unsubscribeModuleStatus = subscribe(EVENT_TYPES.MODULE_STATUS_CHANGED, (data: any) => {
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
    const unsubscribeAdminGranted = subscribe(EVENT_TYPES.ADMIN_ACCESS_GRANTED, () => {
      console.log("useModuleMenuEvents: Événement ADMIN_ACCESS_GRANTED reçu");
      debouncedRefresh();
      
      toast({
        title: "Accès administrateur",
        description: "Vous avez maintenant accès aux fonctionnalités d'administration",
        variant: "default"
      });
    });
    
    // Événement: Accès admin révoqué
    const unsubscribeAdminRevoked = subscribe(EVENT_TYPES.ADMIN_ACCESS_REVOKED, () => {
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
      unsubscribeMenuUpdated();
      unsubscribeModuleStatus();
      unsubscribeAdminGranted();
      unsubscribeAdminRevoked();
    };
  }, [debouncedRefresh, toast, subscribe, EVENT_TYPES]);

  return { 
    isUserAdmin, 
    refreshMenu 
  };
};
