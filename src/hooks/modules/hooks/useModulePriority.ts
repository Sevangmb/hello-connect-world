
import { useState, useCallback } from 'react';
import { AppModule } from '../types';

export const useModulePriority = () => {
  const [isLoading, setIsLoading] = useState(false);
  const priorityModules = ['core', 'admin', 'auth'];
  
  // Sort modules by priority - core modules first, then by priority field
  const sortModulesByPriority = useCallback((modules: AppModule[]) => {
    return [...modules].sort((a, b) => {
      // Core modules always come first
      if (a.is_core && !b.is_core) return -1;
      if (!a.is_core && b.is_core) return 1;
      
      // Admin modules come next
      if (a.is_admin && !b.is_admin) return -1;
      if (!a.is_admin && b.is_admin) return 1;
      
      // Then sort by priority field
      return (a.priority || 0) - (b.priority || 0);
    });
  }, []);
  
  // Preload priority modules
  const preloadPriorityModules = async () => {
    setIsLoading(true);
    try {
      // Preload logic for priority modules
      await Promise.all(priorityModules.map(async (moduleCode) => {
        await incrementModuleUsage(moduleCode);
      }));
    } catch (error) {
      console.error("Error preloading priority modules:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Increment module usage count
  const incrementModuleUsage = async (moduleCode: string) => {
    try {
      // Module usage increment logic
      console.log(`Incrementing usage for module: ${moduleCode}`);
    } catch (error) {
      console.error(`Error incrementing module usage: ${error}`);
    }
  };
  
  return {
    priorityModules,
    isLoading,
    preloadPriorityModules,
    incrementModuleUsage,
    sortModulesByPriority
  };
};
