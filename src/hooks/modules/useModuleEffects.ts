
import { useEffect } from 'react';
import { AppModule } from './types';

/**
 * Manages side effects for module data
 */
export const useModuleEffects = (
  modules: AppModule[], 
  setModules: React.Dispatch<React.SetStateAction<AppModule[]>>, 
  fetchModules: () => Promise<AppModule[]>,
  fetchDependencies: () => Promise<any[]>,
  fetchFeatures: () => Promise<Record<string, Record<string, boolean>>>
) => {
  // Initial load effect
  useEffect(() => {
    const loadData = async () => {
      await fetchModules();
      await fetchDependencies();
      await fetchFeatures();
    };
    
    loadData();
    
    // Setup refresh interval
    const refreshInterval = setInterval(async () => {
      await fetchModules();
    }, 60000);
    
    // Cleanup function
    return () => {
      clearInterval(refreshInterval);
    };
  }, [fetchModules, fetchDependencies, fetchFeatures]);
};
