
import { MenuItem } from "@/services/menu/types";
import * as LucideIcons from "lucide-react";

/**
 * Vérifier si un chemin est actif dans la navigation
 */
export const isActiveRoute = (path: string, currentPath: string): boolean => {
  // Normaliser le chemin pour la comparaison
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  
  if (normalizedPath === '/') {
    return normalizedCurrentPath === '/' || normalizedCurrentPath === '';
  }
  
  // Vérifier si le chemin actuel correspond exactement ou est un sous-chemin
  return normalizedCurrentPath === normalizedPath || 
         normalizedCurrentPath.startsWith(`${normalizedPath}/`);
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
 * Cette liste est extensible selon les besoins de l'application
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
  '/social/groups',
  '/wardrobe',
  '/wardrobe/outfits',
  '/wardrobe/suitcases',
  '/boutiques',
  '/cart',
  '/admin',
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
  '/suitcases',
  // Routes de base (pour être plus permissif)
  '/community',
  '/settings',
  '/home'
];

/**
 * Vérifier si une route existe
 * Cette implémentation est plus permissive pour permettre aux développeurs
 * d'ajouter des nouvelles routes sans bloquer le menu
 */
export const routeExists = (path: string): boolean => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // En mode développement ou lorsque validRoutes est vide, accepter toutes les routes
  if (validRoutes.length === 0 || process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // Check if path exactly matches a route or is a sub-route
  const exists = validRoutes.some(route => 
    route === normalizedPath || 
    route.startsWith(`${normalizedPath}/`) ||
    normalizedPath.startsWith(`${route}/`)
  );
  
  // Log uniquement si la route n'existe pas
  if (!exists) {
    console.warn(`Route not found in validRoutes: ${normalizedPath}`);
  }
  
  return exists;
};

/**
 * Construire une hiérarchie de menus
 */
export const buildMenuHierarchy = (items: MenuItem[]): MenuItem[] => {
  if (!items || items.length === 0) {
    console.log("buildMenuHierarchy: No items to process");
    return [];
  }
  
  console.log(`buildMenuHierarchy: Building hierarchy for ${items.length} items`);
  
  // Map pour stocker les items par ID pour un accès rapide
  const itemMap = new Map<string, MenuItem & { children?: MenuItem[] }>();
  
  // Première passe : créer une copie de chaque item avec un tableau children vide
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });
  
  // Identifier les items racine (sans parent)
  const rootItems: MenuItem[] = [];
  
  // Deuxième passe : construire la hiérarchie
  items.forEach(item => {
    const itemCopy = itemMap.get(item.id);
    if (!itemCopy) return;
    
    if (item.parent_id && itemMap.has(item.parent_id)) {
      // Cet item a un parent valide, l'ajouter comme enfant
      const parent = itemMap.get(item.parent_id);
      if (parent && parent.children) {
        parent.children.push(itemCopy);
      }
    } else {
      // C'est un item racine
      rootItems.push(itemCopy);
    }
  });
  
  // Trier les items racine et les enfants par position/ordre
  const sortItems = (items: MenuItem[]): MenuItem[] => {
    return [...items].sort((a, b) => {
      if (a.position !== undefined && b.position !== undefined) {
        return a.position - b.position;
      }
      return (a.order || 999) - (b.order || 999);
    });
  };
  
  // Trier les items racine
  const sortedRootItems = sortItems(rootItems);
  
  // Trier récursivement tous les enfants
  const sortChildrenRecursively = (items: MenuItem[]) => {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children = sortItems(item.children);
        sortChildrenRecursively(item.children);
      }
    });
  };
  
  sortChildrenRecursively(sortedRootItems);
  
  console.log(`buildMenuHierarchy: Finished with ${sortedRootItems.length} root items`);
  return sortedRootItems;
};
