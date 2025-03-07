
import { memoize } from 'lodash';
import { icons } from 'lucide-react';
import { MenuItem } from '@/services/menu/types';

/**
 * Vérifie si le chemin courant correspond à la route active
 */
export const isActiveRoute = (routePath: string, currentPath: string): boolean => {
  // Normalisation des chemins
  const normalizedRoute = routePath.endsWith('/') ? routePath.slice(0, -1) : routePath;
  const normalizedCurrent = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
  
  // Vérification exacte pour la page d'accueil
  if (normalizedRoute === '/' || normalizedRoute === '') {
    return normalizedCurrent === '/' || normalizedCurrent === '';
  }
  
  // Vérification exacte pour tous les autres chemins
  return normalizedCurrent === normalizedRoute || 
    // Ou vérification que le chemin courant commence par le chemin de la route
    // (pour les routes imbriquées)
    normalizedCurrent.startsWith(`${normalizedRoute}/`);
};

/**
 * Vérifie si une route existe dans l'application
 * Note: Pour une vérification complète dans une application réelle, on pourrait 
 * utiliser la liste des routes disponibles dans React Router
 */
export const routeExists = (path: string): boolean => {
  // Simplification de la vérification: nous supposons que toutes les routes
  // disponibles dans l'application sont valides
  
  // Mais nous filtrons les chemins qui semblent invalides
  const invalidPaths = [undefined, null, '', '#', 'javascript:void(0)'];
  return !invalidPaths.includes(path as any);
};

/**
 * Récupère l'icône à partir de la bibliothèque Lucide React
 */
export const getIcon = memoize((iconName: string | undefined) => {
  if (!iconName) return null;
  return (icons as any)[iconName];
});

/**
 * Transforme un texte en kebab-case (pour les URLs)
 */
export const toKebabCase = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

/**
 * Transforme un texte en camelCase (pour les noms de variables)
 */
export const toCamelCase = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[\s-_]+(.)/g, (_, c) => c.toUpperCase());
};

/**
 * Construit la hiérarchie des éléments de menu
 * Transforme une liste plate d'éléments en structure hiérarchique
 */
export const buildMenuHierarchy = (items: MenuItem[]): MenuItem[] => {
  if (!items || items.length === 0) {
    return [];
  }
  
  // Créer un map pour accéder rapidement aux éléments par ID
  const itemMap = new Map<string, MenuItem>();
  
  // Copier les éléments pour éviter de modifier l'original
  const itemsCopy = items.map(item => ({
    ...item,
    children: [] as MenuItem[]
  }));
  
  // Alimenter le map
  itemsCopy.forEach(item => {
    itemMap.set(item.id, item);
  });
  
  // Construire la hiérarchie
  const rootItems: MenuItem[] = [];
  
  itemsCopy.forEach(item => {
    if (item.parent_id) {
      // Cet élément a un parent
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        // Ajouter cet élément comme enfant de son parent
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      } else {
        // Si le parent n'existe pas, traiter comme élément racine
        rootItems.push(item);
      }
    } else {
      // Cet élément est un élément racine
      rootItems.push(item);
    }
  });
  
  // Trier les éléments par position ou ordre
  const sortItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .sort((a, b) => {
        if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position;
        }
        return (a.order || 999) - (b.order || 999);
      })
      .map(item => {
        if (item.children && item.children.length > 0) {
          item.children = sortItems(item.children);
        }
        return item;
      });
  };
  
  return sortItems(rootItems);
};
