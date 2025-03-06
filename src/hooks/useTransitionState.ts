
import { useState, useEffect } from 'react';

/**
 * Hook pour gérer les transitions d'état et éviter les clignotements
 * @param isLoading État de chargement actuel
 * @param delay Délai minimum pour l'état de chargement (ms)
 * @returns État de transition
 */
export function useTransitionState(isLoading: boolean, delay: number = 300) {
  const [isTransitioning, setIsTransitioning] = useState(isLoading);
  
  useEffect(() => {
    if (isLoading) {
      setIsTransitioning(true);
    } else {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, delay]);
  
  return isTransitioning;
}
