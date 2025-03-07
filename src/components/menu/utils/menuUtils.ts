
import { MenuItem } from "@/services/menu/types";
import * as LucideIcons from "lucide-react";

/**
 * Vérifier si un chemin est actif dans la navigation
 */
export const isActiveRoute = (path: string, currentPath: string): boolean => {
  // Normaliser le chemin pour la comparaison
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  if (normalizedPath === '/') {
    return currentPath === '/' || currentPath === '';
  }
  
  return currentPath === normalizedPath || 
         currentPath.startsWith(`${normalizedPath}/`);
};

/**
 * Récupérer l'icône à partir de la bibliothèque Lucide
 * Retourne le composant d'icône (et non le JSX)
 */
export const getIcon = (iconName: string | undefined) => {
  if (!iconName) return null;
  
  // Récupérer l'icône depuis la bibliothèque Lucide
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
  return IconComponent || null;
};

/**
 * Liste des routes valides existantes pour vérification
 */
export const validRoutes = [
  '/',
  '/explore',
  '/personal',
  '/profile',
  '/profile/settings',
  '/search',
  '/notifications',
  '/social/challenges',
  '/social/friends',
  '/social/messages',
  '/wardrobe/outfits',
  '/wardrobe/suitcases',
  '/boutiques',
  '/cart',
  '/admin/dashboard',
  '/admin/modules', 
  '/admin/users',
  '/admin/shops',
  '/admin/settings',
  '/admin/menus',
  '/admin/stats',
  '/admin/analytics',
  '/admin/marketing',
  '/admin/content',
  '/admin/backups',
  '/admin/notifications',
  '/admin/moderation',
  '/admin/reports',
  '/admin/marketplace',
  '/admin/payments',
  '/admin/orders',
  '/admin/api-keys',
  '/admin/help',
  '/admin/waitlist',
  '/legal',
  '/terms',
  '/privacy',
  '/contact',
  '/about',
  '/stores',
  '/shop',
  '/challenges',
  '/messages',
  '/friends',
  '/outfits',
  '/suitcases'
];

/**
 * Vérifier si une route existe
 */
export const routeExists = (path: string): boolean => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return validRoutes.some(route => 
    route === normalizedPath || 
    route.startsWith(`${normalizedPath}/`) ||
    normalizedPath.startsWith(`${route}/`)
  );
};
