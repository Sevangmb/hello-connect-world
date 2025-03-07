
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
  const { data: allItems, isLoading } = useAllMenuItems();

  useEffect(() => {
    const processMenuItems = () => {
      try {
        if (!allItems) {
          setMenuItems([]);
          return;
        }

        let filteredItems = allItems;
        
        // Filtrer par catégorie si spécifiée
        if (category) {
          filteredItems = allItems.filter(item => item.category === category);
        }
        
        // Filtrer par module si spécifié
        if (moduleCode) {
          filteredItems = allItems.filter(item => item.module_code === moduleCode);
        }

        setMenuItems(filteredItems);
        setError(null);
        setInitialized(true);
      } catch (err: any) {
        console.error("Erreur lors du traitement des éléments de menu:", err);
        setError(err.message || "Échec du traitement des éléments de menu");
        setMenuItems([]);
        
        toast({
          title: "Erreur de chargement",
          description: "Problème lors du chargement du menu",
          variant: "destructive"
        });
      }
    };

    setLoading(isLoading);
    if (!isLoading) {
      processMenuItems();
    }
  }, [allItems, isLoading, category, moduleCode, setLoading, setMenuItems, setError, setInitialized, toast]);

  return {
    isLoading,
    refetch: () => {} // La fonction refetch n'est plus nécessaire car le menu est statique
  };
};
