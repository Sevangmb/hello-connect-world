
import { useEffect, useMemo } from 'react';
import { MenuItem } from '@/services/menu/types';
import { useMenuItemsByParent } from './useMenuItems';

interface UseMenuProcessorOptions {
  menuItems: MenuItem[];
  isUserAdmin: boolean;
  hierarchical: boolean;
  setMenuItems: (items: MenuItem[]) => void;
  setError: (error: string | null) => void;
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
    return new Set(rawItems.filter(item => !item.parent_id).map(item => item.id));
  }, [rawItems]);
  
  // Filtrer et traiter les éléments du menu
  useEffect(() => {
    try {
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
        // Créer une carte pour un accès rapide aux éléments
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
          } else if (rootItemIds.has(item.id) || !item.parent_id) {
            // Élément racine
            rootItems.push(item);
          }
        });
        
        // Trier les éléments racine par position/ordre
        const sortedRootItems = rootItems.sort((a, b) => {
          if (a.position !== undefined && b.position !== undefined) {
            return a.position - b.position;
          }
          return (a.order || 999) - (b.order || 999);
        });
        
        // Trier les enfants de chaque élément
        itemsMap.forEach(item => {
          if (item.children.length > 0) {
            item.children.sort((a, b) => {
              if (a.position !== undefined && b.position !== undefined) {
                return a.position - b.position;
              }
              return (a.order || 999) - (b.order || 999);
            });
          }
        });
        
        console.log(`Menu processor: Found ${rootItems.length} root items and ${filteredItems.length - rootItems.length} child items`);
        setMenuItems(sortedRootItems);
      } else {
        setMenuItems(filteredItems);
      }

      setError(null);
    } catch (err: any) {
      console.error("Erreur lors du traitement des éléments de menu:", err);
      setError(err.message || "Échec du traitement des éléments de menu");
      setMenuItems([]);
      
      toast({
        title: "Erreur de traitement",
        description: "Problème lors du traitement des éléments de menu",
        variant: "destructive"
      });
    }
  }, [rawItems, isUserAdmin, hierarchical, setMenuItems, setError, toast, rootItemIds]);
};
