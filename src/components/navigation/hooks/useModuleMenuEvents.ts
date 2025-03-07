
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
  const { subscribe, subscribeToMultiple, EVENT_TYPES } = useEvents();
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
    // Ensemble d'événements qui déclenchent un rafraîchissement du menu
    const menuRefreshEvents = [
      EVENT_TYPES.MENU_UPDATED,
      EVENT_TYPES.MODULE_STATUS_CHANGED,
      EVENT_TYPES.ADMIN_ACCESS_GRANTED,
      EVENT_TYPES.ADMIN_ACCESS_REVOKED
    ];
    
    // S'abonner à plusieurs événements avec un seul callback
    const unsubscribeRefreshEvents = subscribeToMultiple(menuRefreshEvents, () => {
      debouncedRefresh();
    });
    
    // Événement: Statut de module changé (pour les notifications)
    const unsubscribeModuleStatus = subscribe(EVENT_TYPES.MODULE_STATUS_CHANGED, (data: any) => {
      // Afficher une notification si le module a été désactivé ou activé
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
    
    // Événement: Accès admin accordé (pour la notification)
    const unsubscribeAdminGranted = subscribe(EVENT_TYPES.ADMIN_ACCESS_GRANTED, () => {
      toast({
        title: "Accès administrateur",
        description: "Vous avez maintenant accès aux fonctionnalités d'administration",
        variant: "default"
      });
    });
    
    // Nettoyage à la désinscription du composant
    return () => {
      // Annuler tout timer en cours
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      
      // Désabonner tous les événements
      unsubscribeRefreshEvents();
      unsubscribeModuleStatus();
      unsubscribeAdminGranted();
    };
  }, [debouncedRefresh, toast, subscribe, subscribeToMultiple, EVENT_TYPES]);

  return { 
    isUserAdmin, 
    refreshMenu 
  };
};
