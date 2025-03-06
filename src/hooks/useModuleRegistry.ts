
import { useState, useEffect } from 'react';
import { ModuleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { AppModule } from './modules/types';

const moduleApi = new ModuleApiGateway(/* Add any required dependencies */);

export const useModuleRegistry = () => {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  const initializeModules = async () => {
    try {
      setLoading(true);
      const allModules = await moduleApi.getAllModules();
      setModules(allModules);
      setInitialized(true);
    } catch (err) {
      console.error('Error loading modules:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const isModuleActive = async (moduleCode: string): Promise<boolean> => {
    try {
      return await moduleApi.isModuleActive(moduleCode);
    } catch (err) {
      console.error(`Error checking module ${moduleCode} status:`, err);
      return false;
    }
  };

  const isModuleDegraded = async (moduleCode: string): Promise<boolean> => {
    try {
      return await moduleApi.isModuleDegraded(moduleCode);
    } catch (err) {
      console.error(`Error checking if module ${moduleCode} is degraded:`, err);
      return false;
    }
  };

  useEffect(() => {
    initializeModules();
  }, []);

  return { 
    modules, 
    loading, 
    error, 
    initialized,
    initializeModules,
    isModuleActive,
    isModuleDegraded 
  };
};
