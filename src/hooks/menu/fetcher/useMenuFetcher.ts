
import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { processMenuItems } from './dataProcessor';
import { handleMenuFetchError } from './errorHandler';
import { eventBus } from '@/core/event-bus/EventBus';
import { EVENTS } from '@/core/event-bus/constants';

interface UseMenuFetcherOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  setLoading: (loading: boolean) => void;
  setMenuItems: (items: MenuItem[]) => void;
  setError: (error: Error | null) => void;
  setInitialized: (initialized: boolean) => void;
  toast?: any;
}

export const useMenuFetcher = (options: UseMenuFetcherOptions) => {
  const {
    category,
    moduleCode,
    setLoading,
    setMenuItems,
    setError,
    setInitialized,
    toast
  } = options;

  // Construire la requête
  const buildQuery = useCallback(() => {
    let query = supabase.from('menu_items').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (moduleCode) {
      query = query.eq('module_code', moduleCode);
    }
    
    return query.order('position');
  }, [category, moduleCode]);

  // Requête pour récupérer les éléments de menu
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['menu-items', { category, moduleCode }],
    queryFn: async () => {
      try {
        setLoading(true);
        const query = buildQuery();
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Publier un événement pour la récupération des éléments de menu
        eventBus.publish(EVENTS.NAVIGATION.MENU_OPEN, {
          category,
          moduleCode,
          count: data?.length || 0,
          timestamp: Date.now()
        });
        
        return data || [];
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        if (toast) {
          handleMenuFetchError(err, setError, setMenuItems, toast);
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mettre à jour les éléments de menu lorsque les données changent
  useEffect(() => {
    if (data) {
      try {
        const processedItems = processMenuItems(data);
        setMenuItems(processedItems);
        setInitialized(true);
        
        // Publier un événement pour les éléments de menu traités
        eventBus.publish(EVENTS.NAVIGATION.MENU_OPEN, {
          category,
          moduleCode,
          count: processedItems.length,
          timestamp: Date.now()
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Publier un événement d'erreur
        eventBus.publish(EVENTS.SYSTEM.ERROR, {
          source: 'MenuFetcher',
          category,
          moduleCode,
          error: err instanceof Error ? err.message : String(err),
          timestamp: Date.now()
        });
      }
    }
  }, [data, category, moduleCode, setMenuItems, setError, setInitialized]);

  // Mettre à jour l'état d'erreur
  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    } else {
      setError(null);
    }
  }, [error, setError]);

  return { data, isLoading, error, refetch };
};

export default useMenuFetcher;
