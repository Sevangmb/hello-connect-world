
import { useState, useEffect, useRef, useCallback } from 'react';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { MenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { useToast } from '@/hooks/use-toast';
import { useModules } from '@/hooks/modules/useModules';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';
import { useAdminStatus } from './useAdminStatus';
import { menuCache } from './utils/menuCache';
import { fetchMenuItems } from './utils/menuFetcher';
import { subscribeToMenuEvents } from './utils/menuEvents';

interface UseMenuItemsOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
}

/**
 * Hook for retrieving and managing menu items
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
  const cacheRef = useRef<{
    items: MenuItem[];
    timestamp: number;
    key: string;
  } | null>(null);
  
  // Generate a cache key based on current options
  const getCacheKey = useCallback(() => {
    return menuCache.generateKey({
      category: options?.category,
      moduleCode: options?.moduleCode,
      hierarchical: options?.hierarchical,
      isAdmin: isUserAdmin,
    });
  }, [options?.category, options?.moduleCode, options?.hierarchical, isUserAdmin]);
  
  // Fetch menu items with debounce and caching
  const fetchAndUpdateMenuItems = useCallback(async (force = false) => {
    // Avoid multiple concurrent fetches
    if (fetchingRef.current) {
      console.log("Fetch menu already in progress, skipping");
      return;
    }
    
    const cacheKey = getCacheKey();
    
    // Check cache validity
    if (!force && menuCache.isValid(cacheRef.current, cacheKey)) {
      console.log("Using cached menu items");
      setMenuItems(cacheRef.current!.items);
      setLoading(false);
      return;
    }
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Create a new debounce timer
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        fetchingRef.current = true;
        
        const items = await fetchMenuItems({
          category: options?.category,
          moduleCode: options?.moduleCode,
          hierarchical: options?.hierarchical,
          isAdmin: isUserAdmin,
          modules,
        });
        
        // Update cache
        cacheRef.current = menuCache.create(items, cacheKey);
        
        setMenuItems(items);
        setError(null);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load menu");
        toast({
          title: "Error",
          description: "Failed to load menu",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        fetchingRef.current = false;
        debounceTimerRef.current = null;
      }
    }, 100); // Small delay to combine multiple fetches
  }, [options?.category, options?.moduleCode, options?.hierarchical, isUserAdmin, modules, toast, getCacheKey]);
  
  // Initial data loading
  useEffect(() => {
    fetchAndUpdateMenuItems();
  }, [fetchAndUpdateMenuItems]);
  
  // Listen for menu events
  useEffect(() => {
    // Debounced event handler to prevent too frequent updates
    const handleMenuEvent = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        fetchAndUpdateMenuItems(true); // Force refresh on events
        debounceTimerRef.current = null;
      }, 300); // 300ms delay
    };
    
    // Subscribe to all menu-related events
    const unsubscribe = subscribeToMenuEvents(handleMenuEvent);
    
    return () => {
      unsubscribe();
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchAndUpdateMenuItems]);
  
  return {
    menuItems,
    loading,
    error,
    refreshMenu: () => fetchAndUpdateMenuItems(true) // Force refresh
  };
};
