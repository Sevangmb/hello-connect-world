
import { useState, useEffect, useCallback } from 'react';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { useToast } from '@/hooks/use-toast';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_MENU_EVENTS } from '@/services/coordination/ModuleMenuCoordinator';

/**
 * Hook pour gérer l'état du menu et sa synchronisation
 */
export const useMenuState = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  // Fonction pour rafraîchir les données du menu (implémentée dans useMenu)
  const refreshMenu = useCallback(() => {
    setLoading(true);
    console.log("useMenu: Rafraîchissement du menu");
    
    // Cette fonction sera étendue dans useMenu
    
    // Force loading to stop after 5 seconds in case of issues
    setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("Timeout de chargement dépassé");
      }
    }, 5000);
  }, [loading]);

  // Écouter les événements de mise à jour du menu
  useEffect(() => {
    const onMenuUpdated = () => {
      console.log("useMenu: Événement MENU_UPDATED reçu");
      refreshMenu();
    };
    
    // Subscribe returns an unsubscribe function, store it to call it on cleanup
    const unsubscribe = eventBus.subscribe(MODULE_MENU_EVENTS.MENU_UPDATED, onMenuUpdated);
    
    return () => {
      // Call the unsubscribe function directly
      unsubscribe();
    };
  }, [refreshMenu]);

  return {
    menuItems,
    setMenuItems,
    loading,
    setLoading,
    error,
    setError,
    initialized,
    setInitialized,
    refreshMenu,
    toast
  };
};
