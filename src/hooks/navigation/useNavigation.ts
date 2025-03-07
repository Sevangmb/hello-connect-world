
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Normaliser les chemins pour la cohérence
  const normalizePath = useCallback((path: string): string => {
    return path.startsWith('/') ? path : `/${path}`;
  }, []);

  // Vérifier si un chemin est actif
  const isActivePath = useCallback((path: string): boolean => {
    const normalizedPath = normalizePath(path);
    const currentPath = location.pathname;
    
    if (normalizedPath === '/') {
      return currentPath === '/';
    }
    
    // Un chemin est actif s'il correspond exactement ou s'il est parent
    return currentPath === normalizedPath || 
           currentPath.startsWith(`${normalizedPath}/`);
  }, [location.pathname, normalizePath]);

  // Naviguer vers un chemin
  const navigateTo = useCallback((path: string, options?: { replace?: boolean }): void => {
    const normalizedPath = normalizePath(path);
    console.log(`Navigation vers: ${normalizedPath}`);
    navigate(normalizedPath, options);
  }, [navigate, normalizePath]);

  return {
    currentPath: location.pathname,
    isActivePath,
    navigateTo,
    normalizePath
  };
};

export default useNavigation;
