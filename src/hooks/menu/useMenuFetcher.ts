
import { useEffect } from 'react';
import { useAllMenuItems } from './useMenuItems';
import { MenuItemCategory } from '@/services/menu/types';

interface UseMenuFetcherOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  setLoading: (loading: boolean) => void;
  setMenuItems: (items: any[]) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  toast: any;
}

export const useMenuFetcher = ({
  category,
  moduleCode,
  setLoading,
  setMenuItems,
  setError,
  setInitialized,
  toast
}: UseMenuFetcherOptions) => {
  // Utiliser le hook useAllMenuItems pour récupérer tous les éléments de menu
  const { data: allItems, isLoading, refetch } = useAllMenuItems();

  useEffect(() => {
    const processMenuItems = () => {
      try {
        // Si les données ne sont pas encore disponibles, sortir
        if (!allItems) {
          setMenuItems([]);
          return;
        }

        let filteredItems = [...allItems];
        
        // Filtrer par catégorie si spécifiée
        if (category) {
          filteredItems = filteredItems.filter(item => item.category === category);
        }
        
        // Filtrer par module si spécifié
        if (moduleCode) {
          filteredItems = filteredItems.filter(item => item.module_code === moduleCode);
        }

        // Trier par position/ordre pour une affichage cohérent
        filteredItems = filteredItems.sort((a, b) => {
          // D'abord par position s'il est défini
          if (a.position !== undefined && b.position !== undefined) {
            return a.position - b.position;
          }
          // Ensuite par ordre s'il est défini
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          // Par défaut, pas de tri spécifique
          return 0;
        });

        setMenuItems(filteredItems);
        setError(null);
        setInitialized(true);
      } catch (err: any) {
        console.error("Erreur lors du traitement des éléments de menu:", err);
        setError(err.message || "Échec du traitement des éléments de menu");
        setMenuItems([]);
      }
    };

    setLoading(isLoading);
    if (!isLoading) {
      processMenuItems();
    }
  }, [allItems, isLoading, category, moduleCode, setLoading, setMenuItems, setError, setInitialized]);

  return {
    isLoading,
    refetch
  };
};
