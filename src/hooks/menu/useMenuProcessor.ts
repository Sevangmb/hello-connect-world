
import { useEffect } from 'react';
import { MenuItem } from '@/services/menu/types';

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
  }, [rawItems, isUserAdmin, hierarchical, setMenuItems, setError, toast]);
};
