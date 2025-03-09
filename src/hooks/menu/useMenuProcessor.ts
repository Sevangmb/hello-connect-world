
import { useEffect, useMemo } from 'react';
import { MenuItem } from '@/services/menu/types';
import { useMenuItemsByParent } from './useMenuItems';
import { buildMenuHierarchy } from '@/components/menu/utils/menuUtils';

interface UseMenuProcessorOptions {
  menuItems: MenuItem[];
  isUserAdmin: boolean;
  hierarchical: boolean;
  setMenuItems: (items: MenuItem[]) => void;
  setError: (error: Error | null) => void;
  toast: any;
}

/**
 * Hook pour filtrer et traiter les éléments de menu
 */
export const useMenuProcessor = ({
  menuItems: rawItems,
  isUserAdmin,
  hierarchical,
  setMenuItems,
  setError,
  toast
}: UseMenuProcessorOptions) => {
  
  // Identifier les éléments racine (sans parent_id)
  const rootItemIds = useMemo(() => {
    if (!rawItems || rawItems.length === 0) {
      return new Set<string>();
    }
    return new Set(rawItems.filter(item => !item.parent_id).map(item => item.id));
  }, [rawItems]);
  
  // Filtrer et traiter les éléments du menu
  useEffect(() => {
    const processMenuItems = async () => {
      try {
        if (!rawItems || rawItems.length === 0) {
          console.log("useMenuProcessor: No raw menu items to process");
          setMenuItems([]);
          return;
        }
        
        console.log(`useMenuProcessor: Processing ${rawItems.length} menu items, hierarchical: ${hierarchical}`);
        
        // Filtrer en fonction des autorisations de l'utilisateur
        const filteredItems = rawItems.filter(item => {
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
          // Si nous n'avons pas d'éléments après filtrage, ne pas traiter davantage
          if (filteredItems.length === 0) {
            setMenuItems([]);
            return;
          }
          
          const hierarchicalItems = buildMenuHierarchy(filteredItems);
          console.log(`Menu processor: Found ${hierarchicalItems.length} root items in hierarchy`);
          setMenuItems(hierarchicalItems);
        } else {
          // Pour les menus non hiérarchiques, trier simplement par position/ordre
          const sortedItems = [...filteredItems].sort((a, b) => {
            if (a.position !== undefined && b.position !== undefined) {
              return a.position - b.position;
            }
            return (a.order || 999) - (b.order || 999);
          });
          
          console.log(`Menu processor: Sorted ${sortedItems.length} non-hierarchical items`);
          setMenuItems(sortedItems);
        }

        setError(null);
      } catch (err: any) {
        console.error("Erreur lors du traitement des éléments de menu:", err);
        setError(err instanceof Error ? err : new Error(err.message || String(err)));
        setMenuItems([]);
        
        toast({
          title: "Erreur de traitement",
          description: "Problème lors du traitement des éléments de menu",
          variant: "destructive"
        });
      }
    };
    
    // Lancer le traitement des éléments de menu
    processMenuItems();
  }, [rawItems, isUserAdmin, hierarchical, setMenuItems, setError, toast, rootItemIds]);
};
