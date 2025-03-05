
/**
 * Hook pour suivre l'utilisation des modules
 */
import { useState, useCallback } from 'react';
import { moduleService } from '@/services/modules/services/ModuleServiceImpl';

// Constantes pour les modules prioritaires
const CORE_MODULES = ['auth', 'profile', 'menu'];

export const useModuleUsage = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Précharge les modules prioritaires
   */
  const preloadPriorityModules = useCallback(async () => {
    setIsLoading(true);
    try {
      // Précharger chaque module prioritaire
      await Promise.all(CORE_MODULES.map(async (moduleCode) => {
        await moduleService.isModuleActive(moduleCode);
      }));
    } catch (error) {
      console.error("Erreur lors du préchargement des modules prioritaires:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Incrémente le compteur d'utilisation d'un module
   */
  const incrementModuleUsage = useCallback(async (moduleCode: string) => {
    try {
      await moduleService.recordModuleUsage(moduleCode);
    } catch (error) {
      console.error(`Erreur lors de l'incrémentation de l'utilisation du module ${moduleCode}:`, error);
    }
  }, []);
  
  return {
    priorityModules: CORE_MODULES,
    isLoading,
    preloadPriorityModules,
    incrementModuleUsage
  };
};
