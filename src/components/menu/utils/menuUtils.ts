
import { memoize } from 'lodash';
import { icons } from 'lucide-react';

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
