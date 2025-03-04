
import { useState, useEffect, useRef, useCallback } from 'react';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
// Fix import path
import { MenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { useToast } from '@/hooks/use-toast';
import { useModules } from '@/hooks/modules/useModules';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_MENU_EVENTS } from '@/services/coordination/ModuleMenuCoordinator';
import { useAdminStatus } from './useAdminStatus';

interface UseMenuItemsOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
}

/**
 * Hook pour récupérer et gérer les éléments de menu avec stabilité
 */
export const useMenuItems = (options?: UseMenuItemsOptions) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { modules } = useModules();
  const { isUserAdmin } = useAdminStatus();
  const fetchingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cache pour éviter des recalculs fréquents
  const cacheRef = useRef<{
    items: MenuItem[],
    timestamp: number,
    key: string
  } | null>(null);
  
  // Fonction pour générer une clé de cache
  const getCacheKey = useCallback(() => {
    return `${options?.category || 'all'}-${options?.moduleCode || 'none'}-${isUserAdmin ? 'admin' : 'user'}-${options?.hierarchical ? 'tree' : 'flat'}`;
  }, [options?.category, options?.moduleCode, options?.hierarchical, isUserAdmin]);
  
  // Fonction de fetch avec débounce et cache
  const fetchMenuItems = useCallback(async (force = false) => {
    // Éviter les fetches multiples simultanés
    if (fetchingRef.current) {
      console.log("Fetch menu already in progress, skipping");
      return;
    }
    
    const cacheKey = getCacheKey();
    const now = Date.now();
    
    // Vérifier le cache (valide pendant 10 secondes sauf si force)
    if (!force && cacheRef.current && cacheRef.current.key === cacheKey && now - cacheRef.current.timestamp < 10000) {
      console.log("Using cached menu items");
      setMenuItems(cacheRef.current.items);
      setLoading(false);
      return;
    }
    
    // Annuler tout timer de debounce existant
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Créer un nouveau timer de debounce
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        fetchingRef.current = true;
        let items: MenuItem[] = [];
        
        const adminEnabled = moduleMenuCoordinator.isAdminAccessEnabled();
        
        if (options?.category === 'admin') {
          if (adminEnabled) {
            items = await MenuService.getMenuItemsByCategory('admin', true);
          }
        } else if (options?.category) {
          items = await MenuService.getMenuItemsByCategory(options.category, isUserAdmin);
          
          items = items.filter(item => 
            !item.module_code || moduleMenuCoordinator.isModuleVisibleInMenu(item.module_code, modules)
          );
        } else if (options?.moduleCode) {
          if (!moduleMenuCoordinator.isModuleVisibleInMenu(options.moduleCode, modules)) {
            setMenuItems([]);
            setLoading(false);
            return;
          }
          
          items = await MenuService.getMenuItemsByModule(options.moduleCode, isUserAdmin);
        } else {
          items = await MenuService.getVisibleMenuItems(isUserAdmin);
          
          items = items.filter(item => 
            !item.module_code || moduleMenuCoordinator.isModuleVisibleInMenu(item.module_code, modules)
          );
          
          if (adminEnabled && !options?.category) {
            const adminItems = await MenuService.getMenuItemsByCategory('admin', true);
            const existingIds = new Set(items.map(item => item.id));
            for (const adminItem of adminItems) {
              if (!existingIds.has(adminItem.id)) {
                items.push(adminItem);
              }
            }
          }
        }
        
        if (options?.hierarchical) {
          items = MenuService.buildMenuTree(items);
        }
        
        // Mettre à jour le cache
        cacheRef.current = {
          items,
          timestamp: now,
          key: cacheKey
        };
        
        setMenuItems(items);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des éléments de menu:", err);
        setError("Impossible de charger le menu");
        toast({
          title: "Erreur",
          description: "Impossible de charger le menu",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        fetchingRef.current = false;
        debounceTimerRef.current = null;
      }
    }, 100); // Petit délai pour des fetches simultanés
  }, [options?.category, options?.moduleCode, options?.hierarchical, isUserAdmin, modules, toast, getCacheKey]);
  
  // Effet initial pour charger les données
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);
  
  // Écouter les événements de menu
  useEffect(() => {
    const handleMenuEvent = () => {
      fetchMenuItems(true); // Force refresh on events
    };
    
    // Debounced event handler to prevent too frequent updates
    const debouncedHandler = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        handleMenuEvent();
        debounceTimerRef.current = null;
      }, 300); // 300ms delay
    };
    
    const unsubscribeMenuUpdated = eventBus.subscribe(
      MODULE_MENU_EVENTS.MENU_UPDATED, 
      debouncedHandler
    );
    
    const unsubscribeModuleStatus = eventBus.subscribe(
      MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, 
      debouncedHandler
    );
    
    const unsubscribeAdminAccess = eventBus.subscribe(
      MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, 
      debouncedHandler
    );
    
    const unsubscribeAdminRevoked = eventBus.subscribe(
      MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, 
      debouncedHandler
    );
    
    return () => {
      unsubscribeMenuUpdated();
      unsubscribeModuleStatus();
      unsubscribeAdminAccess();
      unsubscribeAdminRevoked();
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchMenuItems]);
  
  return {
    menuItems,
    loading,
    error,
    refreshMenu: () => fetchMenuItems(true) // Force refresh
  };
};
