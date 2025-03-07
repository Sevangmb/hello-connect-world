
import { useState, useEffect } from 'react';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { AppModule } from './modules/types';

export const useModuleRegistry = () => {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  const initializeModules = async () => {
    try {
      setLoading(true);
      const allModules = await moduleApiGateway.getAllModules();
      setModules(allModules);
      setInitialized(true);
      return allModules;
    } catch (err) {
      console.error('Error initializing modules:', err);
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized) {
      initializeModules();
    }
  }, [initialized]);

  const loadModules = async () => {
    try {
      setLoading(true);
      const allModules = await moduleApiGateway.getAllModules();
      setModules(allModules);
    } catch (err) {
      console.error('Error loading modules:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const isModuleActive = (moduleCode: string): boolean => {
    const module = modules.find(m => m.code === moduleCode);
    return module?.status === 'active';
  };

  const isModuleDegraded = (moduleCode: string): boolean => {
    const module = modules.find(m => m.code === moduleCode);
    return module?.status === 'degraded';
  };

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
