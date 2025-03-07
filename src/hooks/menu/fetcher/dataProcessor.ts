
import { MenuItem } from '@/services/menu/types';

/**
 * Fonction pure pour filtrer et trier les éléments de menu
 */
export const processMenuItems = (
  allItems: MenuItem[] | undefined,
  category?: string,
  moduleCode?: string
): MenuItem[] => {
  try {
    // Si les données ne sont pas encore disponibles, retourner un tableau vide
    if (!allItems) {
      return [];
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
    return filteredItems.sort((a, b) => {
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
  } catch (error) {
    console.error("Erreur lors du traitement des éléments de menu:", error);
    return [];
  }
};
