
import { useEffect, useState, useCallback } from 'react';
import { useAllMenuItems, useMenuItemsByCategory, useMenuItemsByModule } from './useMenuItems';
import { useMenuCategories } from './useMenuCategories';
import { useAdminStatus } from './useAdminStatus';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_MENU_EVENTS } from '@/services/coordination/ModuleMenuCoordinator';
import { useToast } from '@/hooks/use-toast';

interface UseMenuOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
}

// Hook principal pour utiliser le menu
export const useMenu = (options: UseMenuOptions = {}) => {
  const { category, moduleCode, hierarchical = false } = options;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  // Obtenir le statut d'administrateur
  const { isUserAdmin } = useAdminStatus();

  // Requêtes pour les éléments de menu
  const categoryQuery = useMenuItemsByCategory(category as MenuItemCategory);
  const moduleQuery = useMenuItemsByModule(moduleCode as string);
  const allItemsQuery = useAllMenuItems();

  // Catégories de menu
  const menuCategories = useMenuCategories(menuItems);

  // Fonction pour rafraîchir les données du menu
  const refreshMenu = useCallback(() => {
    setLoading(true);
    console.log("useMenu: Rafraîchissement du menu");
    
    if (category) {
      categoryQuery.refetch();
    } else if (moduleCode) {
      moduleQuery.refetch();
    } else {
      allItemsQuery.refetch();
    }
    
    // Force loading to stop after 5 seconds in case of issues
    setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("Timeout de chargement dépassé");
      }
    }, 5000);
  }, [category, moduleCode, categoryQuery, moduleQuery, allItemsQuery, loading]);

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

  // Effet pour définir les éléments de menu en fonction des résultats de la requête
  useEffect(() => {
    const processMenuItems = async () => {
      try {
        setLoading(true);
        let items: MenuItem[] = [];

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

        // Filtrer en fonction des autorisations de l'utilisateur
        const filteredItems = items.filter(item => {
          // Valider que l'item n'est pas null
          if (!item) return false;
          
          // Ne pas montrer les éléments qui nécessitent d'être admin si l'utilisateur n'est pas admin
          if (item.requires_admin && !isUserAdmin) {
            return false;
          }
          
          // Ne pas montrer les éléments inactifs
          if (item.is_active === false) {
            return false;
          }
          
          return item.is_visible !== false;
        });

        // Gérer la structure hiérarchique si nécessaire
        if (hierarchical) {
          // Implémentation simple de la hiérarchie
          const itemsMap = new Map<string, MenuItem & { children: MenuItem[] }>();
          
          // Première passe : créer des entrées pour chaque élément
          filteredItems.forEach(item => {
            itemsMap.set(item.id, { ...item, children: [] });
          });
          
          // Deuxième passe : construire la hiérarchie
          const rootItems: MenuItem[] = [];
          
          filteredItems.forEach(item => {
            if (item.parent_id && itemsMap.has(item.parent_id)) {
              // Ajouter à l'élément parent
              const parent = itemsMap.get(item.parent_id);
              if (parent) {
                parent.children.push(item);
              }
            } else {
              // Élément racine
              rootItems.push(item);
            }
          });
          
          setMenuItems(rootItems);
        } else {
          setMenuItems(filteredItems);
        }

        setError(null);
        setInitialized(true);
      } catch (err: any) {
        console.error("Erreur lors du traitement des éléments de menu:", err);
        setError(err.message || "Échec du chargement des éléments de menu");
        setMenuItems([]);
        
        toast({
          title: "Erreur de chargement",
          description: "Problème lors du traitement des éléments de menu",
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
    hierarchical, 
    isUserAdmin,
    categoryQuery.data,
    categoryQuery.isLoading,
    moduleQuery.data,
    moduleQuery.isLoading,
    allItemsQuery.data,
    allItemsQuery.isLoading,
    toast
  ]);

  return {
    menuItems,
    loading: loading || categoryQuery.isLoading || moduleQuery.isLoading || allItemsQuery.isLoading,
    error,
    isUserAdmin,
    categories: menuCategories,
    refreshMenu,
    initialized
  };
};

// Exporter les sous-hooks pour un accès direct si nécessaire
export { 
  useAllMenuItems,
  useMenuItemsByCategory,
  useMenuItemsByModule,
  useMenuCategories, 
  useAdminStatus 
};
