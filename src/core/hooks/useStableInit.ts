
import { useState, useEffect, useRef } from 'react';

/**
 * Hook utilitaire pour gérer l'initialisation stable des composants
 * Évite les problèmes de clignotement et de chargements multiples
 */
export function useStableInit<T>(
  loadFn: () => Promise<T>,
  initialState: T,
  dependencies: any[] = []
): {
  data: T;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  initialized: boolean;
} {
  const [data, setData] = useState<T>(initialState);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const isLoadingRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  
  // Fonction de rafraîchissement avec protection contre les appels multiples
  const refresh = async (): Promise<void> => {
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      const result = await loadFn();
      
      if (mountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      console.error("Erreur d'initialisation:", err);
      if (mountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setInitialized(true);
      }
      isLoadingRef.current = false;
    }
  };
  
  // Effet d'initialisation
  useEffect(() => {
    mountedRef.current = true;
    
    // Essayer de charger une seule fois au montage et quand les dépendances changent
    refresh();
    
    return () => {
      mountedRef.current = false;
    };
  }, dependencies);
  
  return {
    data,
    loading,
    error,
    refresh,
    initialized
  };
}
