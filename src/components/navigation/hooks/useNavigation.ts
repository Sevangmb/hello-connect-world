
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook pour gérer la navigation avec des fonctionnalités étendues
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour normaliser un chemin
  const normalizePath = useCallback((path: string) => {
    return path.startsWith('/') ? path : `/${path}`;
  }, []);

  // Fonction pour naviguer vers un chemin avec des options avancées
  const navigateTo = useCallback((path: string, options?: { forceRefresh?: boolean }) => {
    const normalizedPath = normalizePath(path);
    
    // Si on est déjà sur le même chemin et qu'on veut forcer un rafraîchissement
    if (location.pathname === normalizedPath && options?.forceRefresh) {
      // Technique pour forcer un rafraîchissement du composant sans recharger la page
      const tempPath = location.pathname === '/' ? '/temp-redirect' : '/';
      navigate(tempPath, { replace: true });
      
      // Après un court délai, rediriger vers le chemin cible
      setTimeout(() => navigate(normalizedPath), 10);
    } else {
      navigate(normalizedPath);
    }
  }, [navigate, location.pathname, normalizePath]);

  // Vérifier si un chemin correspond au chemin actuel
  const isActivePath = useCallback((path: string) => {
    const normalizedPath = normalizePath(path);
    
    if (normalizedPath === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    
    return location.pathname === normalizedPath || 
           location.pathname.startsWith(`${normalizedPath}/`);
  }, [location.pathname, normalizePath]);

  return {
    navigateTo,
    isActivePath,
    currentPath: location.pathname,
    normalizePath
  };
};
