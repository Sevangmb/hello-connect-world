
import { useState, useEffect, useCallback } from 'react';
import { AppModule } from '../types';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';

/**
 * Hook pour gérer le chargement prioritaire des modules
 */
export const useModulePriority = () => {
  const [priorityModules, setPriorityModules] = useState<AppModule[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger les modules prioritaires au démarrage
  useEffect(() => {
    const quickStartModules = moduleOptimizer.getQuickStartModules();
    if (quickStartModules) {
      console.log("Modules prioritaires chargés depuis le cache rapide:", quickStartModules.length);
      setPriorityModules(quickStartModules);
      setIsInitialized(true);
    } else {
      // Si aucun module prioritaire n'est disponible, essayer le cache normal
      try {
        const cachedModules = localStorage.getItem('modules_cache');
        if (cachedModules) {
          const modules = JSON.parse(cachedModules) as AppModule[];
          const essential = moduleOptimizer.getEssentialModules(modules);
          console.log("Modules prioritaires chargés depuis le cache standard:", essential.length);
          setPriorityModules(essential);
          setIsInitialized(true);
          
          // Mettre à jour le cache prioritaire
          moduleOptimizer.optimizeCache(modules);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des modules prioritaires:", error);
      }
    }
    
    // Précharger pour les prochaines visites
    moduleOptimizer.preloadPriorityModules();
  }, []);

  // Optimize les modules avec la nouvelle liste
  const optimizeModules = useCallback((modules: AppModule[]) => {
    const sorted = moduleOptimizer.sortModulesByPriority(modules);
    
    // Mettre à jour le cache
    moduleOptimizer.optimizeCache(sorted);
    
    // Mettre à jour les modules prioritaires
    const essential = moduleOptimizer.getEssentialModules(sorted);
    setPriorityModules(essential);
    
    return sorted;
  }, []);

  return {
    priorityModules,
    isInitialized,
    optimizeModules
  };
};
