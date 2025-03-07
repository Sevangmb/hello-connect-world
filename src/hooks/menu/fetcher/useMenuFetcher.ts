
import { useEffect } from 'react';
import { useAllMenuItems } from '../useMenuItems';
import { MenuFetcherOptions, MenuFetcherResult } from './types';
import { processMenuItems } from './dataProcessor';
import { handleMenuFetchError } from './errorHandler';

/**
 * Hook pour récupérer et traiter les éléments de menu
 * Suit les principes de la Clean Architecture en séparant les responsabilités
 */
export const useMenuFetcher = ({
  category,
  moduleCode,
  setLoading,
  setMenuItems,
  setError,
  setInitialized,
  toast
}: MenuFetcherOptions): MenuFetcherResult => {
  // Utiliser le hook useAllMenuItems pour récupérer tous les éléments de menu
  const { data: allItems, isLoading, refetch } = useAllMenuItems();

  useEffect(() => {
    const fetchAndProcessMenuItems = () => {
      try {
        // Traiter les éléments de menu avec la fonction pure
        const processedItems = processMenuItems(allItems, category, moduleCode);
        
        // Mettre à jour l'état avec les éléments traités
        setMenuItems(processedItems);
        setError(null);
        setInitialized(true);
      } catch (err: any) {
        // Déléguer la gestion des erreurs à un gestionnaire spécialisé
        handleMenuFetchError(err, setError, setMenuItems, toast);
      }
    };

    // Mettre à jour l'état de chargement
    setLoading(isLoading);
    
    // Si le chargement est terminé, traiter les éléments de menu
    if (!isLoading) {
      fetchAndProcessMenuItems();
    }
  }, [allItems, isLoading, category, moduleCode, setLoading, setMenuItems, setError, setInitialized, toast]);

  return {
    isLoading,
    refetch
  };
};
