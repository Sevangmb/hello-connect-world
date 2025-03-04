
import { MenuItem } from "../types";

/**
 * Service pour construire des arborescences de menu
 * Couche Application de la Clean Architecture
 */
export class MenuTreeBuilder {
  /**
   * Construit une arborescence de menu à partir d'une liste plate
   * @param menuItems Liste plate des éléments de menu
   * @returns Arborescence de menu
   */
  buildMenuTree(menuItems: MenuItem[]): MenuItem[] {
    const itemsMap = new Map<string, MenuItem & { children?: MenuItem[] }>();
    const rootItems: (MenuItem & { children?: MenuItem[] })[] = [];
    
    // Créer une map pour un accès rapide aux éléments
    menuItems.forEach(item => {
      itemsMap.set(item.id, { ...item, children: [] });
    });
    
    // Construire l'arborescence
    menuItems.forEach(item => {
      const menuItem = itemsMap.get(item.id)!;
      
      if (item.parent_id && itemsMap.has(item.parent_id)) {
        // Ajouter l'élément au parent
        const parent = itemsMap.get(item.parent_id)!;
        parent.children = parent.children || [];
        parent.children.push(menuItem);
      } else {
        // Ajouter l'élément à la racine
        rootItems.push(menuItem);
      }
    });
    
    return rootItems;
  }
}
