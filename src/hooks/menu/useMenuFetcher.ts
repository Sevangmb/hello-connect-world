
import { useEffect } from 'react';
import { useAllMenuItems, useMenuItemsByCategory, useMenuItemsByModule } from './useMenuItems';
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

/**
 * Hook pour récupérer les données du menu en fonction des options
 */
export const useMenuFetcher = ({
  category,
  moduleCode,
  setLoading,
  setMenuItems,
  setError,
  setInitialized,
  toast
}: UseMenuFetcherOptions) => {
  // Requêtes pour les éléments de menu
  const categoryQuery = useMenuItemsByCategory(category as MenuItemCategory);
  const moduleQuery = useMenuItemsByModule(moduleCode as string);
  const allItemsQuery = useAllMenuItems();

  // Effet pour définir les éléments de menu en fonction des résultats de la requête
  useEffect(() => {
    const processMenuItems = async () => {
      try {
        setLoading(true);
        let items = [];

        // Obtenir les éléments en fonction des options
        if (category && categoryQuery.data) {
          items = categoryQuery.data;
        } else if (moduleCode && moduleQuery.data) {
          items = moduleQuery.data;
        } else if (allItemsQuery.data) {
          items = allItemsQuery.data;
        }

        // Si on n'a pas d'items mais que les requêtes sont chargées, on considère que c'est un problème
        const noItems = items.length === 0;
        const queriesLoaded = (
          (category && !categoryQuery.isLoading) || 
          (moduleCode && !moduleQuery.isLoading) || 
          (!category && !moduleCode && !allItemsQuery.isLoading)
        );
        
        if (noItems && queriesLoaded) {
          // En cas d'absence d'éléments, on affiche un avertissement mais on ne bloque pas l'UI
          console.warn(`useMenu: Aucun élément de menu trouvé pour ${category || moduleCode || 'tous'}`);
        }

        setMenuItems(items);
        setError(null);
        setInitialized(true);
      } catch (err: any) {
        console.error("Erreur lors du chargement des éléments de menu:", err);
        setError(err.message || "Échec du chargement des éléments de menu");
        setMenuItems([]);
        
        toast({
          title: "Erreur de chargement",
          description: "Problème lors du chargement des éléments de menu",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    processMenuItems();
  }, [
    category, 
    moduleCode,
    categoryQuery.data,
    categoryQuery.isLoading,
    moduleQuery.data,
    moduleQuery.isLoading,
    allItemsQuery.data,
    allItemsQuery.isLoading,
    setLoading,
    setMenuItems,
    setError,
    setInitialized,
    toast
  ]);

  return {
    isLoading: categoryQuery.isLoading || moduleQuery.isLoading || allItemsQuery.isLoading,
    refetch: () => {
      if (category) {
        categoryQuery.refetch();
      } else if (moduleCode) {
        moduleQuery.refetch();
      } else {
        allItemsQuery.refetch();
      }
    }
  };
};
