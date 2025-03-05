
/**
 * Hook optimisé pour l'utilisation des modules
 */
import { useEffect } from 'react';
import { useModuleUsage } from './hooks/useModuleUsage';

export const useModuleOptimized = (moduleCode: string) => {
  const { incrementModuleUsage, isLoading } = useModuleUsage();
  
  // Enregistrer l'utilisation du module lors du montage du composant
  useEffect(() => {
    if (moduleCode) {
      console.log(`Module ${moduleCode} utilisé`);
      incrementModuleUsage(moduleCode);
    }
  }, [moduleCode, incrementModuleUsage]);
  
  return {
    isLoading
  };
};
