
import { useCallback, useEffect, useState } from 'react';
import { AppModule } from './types';
import { useModulePriority } from './hooks/useModulePriority';

/**
 * Hook optimisé pour la gestion des modules
 */
export const useModuleOptimized = () => {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [loading, setLoading] = useState(true);
  const { 
    priorityModules,
    recordModuleUsage,
    preloadPriorityModules
  } = useModulePriority();

  // Charger les modules optimisés
  useEffect(() => {
    const loadModules = async () => {
      setLoading(true);
      
      // D'abord vérifier le cache
      const cachedModules = localStorage.getItem('optimized_modules');
      
      if (cachedModules) {
        try {
          const parsed = JSON.parse(cachedModules);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Utiliser les modules en cache
            setModules(parsed);
            setLoading(false);
            
            // Précharger les modules prioritaires en arrière-plan
            setTimeout(() => {
              preloadPriorityModules();
            }, 200);
            
            return;
          }
        } catch (e) {
          console.error("Erreur lors de la lecture des modules en cache:", e);
        }
      }
      
      // Si pas en cache, précharger les modules prioritaires immédiatement
      await preloadPriorityModules();
      setLoading(false);
    };
    
    loadModules();
  }, [preloadPriorityModules]);

  // Enregistrer l'utilisation d'un module
  const trackModuleUsage = useCallback((moduleCode: string) => {
    recordModuleUsage(moduleCode);
  }, [recordModuleUsage]);

  return {
    modules,
    loading,
    priorityModules,
    trackModuleUsage,
    preloadPriorityModules
  };
};
