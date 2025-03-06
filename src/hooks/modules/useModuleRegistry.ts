import { useState, useEffect, useCallback } from 'react';
import { AppModule, ModuleStatus } from './types';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

export function useModuleRegistry() {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        const fetchedModules = await moduleApiGateway.getAllModules();
        setModules(fetchedModules);
      } catch (err) {
        console.error('Error loading modules:', err);
        setError('Failed to load modules');
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  const initializeModules = useCallback(async () => {
    try {
      setLoading(true);
      const initializedModules = await moduleApiGateway.initialize();
      if (initializedModules) {
        const fetchedModules = await moduleApiGateway.getAllModules();
        setModules(fetchedModules);
      }
    } catch (err) {
      console.error('Error initializing modules:', err);
      setError('Failed to initialize modules');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshModules = useCallback(async () => {
    try {
      setLoading(true);
      const refreshedModules = await moduleApiGateway.refreshModules();
      setModules(refreshedModules);
    } catch (err) {
      console.error('Error refreshing modules:', err);
      setError('Failed to refresh modules');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFeatureStatus = useCallback(
    async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
      try {
        setLoading(true);
        await moduleApiGateway.updateFeatureStatus(moduleCode, featureCode, isEnabled);
        // Refresh modules to reflect the updated feature status
        await refreshModules();
      } catch (err) {
        console.error('Error updating feature status:', err);
        setError('Failed to update feature status');
      } finally {
        setLoading(false);
      }
    },
    [refreshModules]
  );

  const isModuleDegraded = useCallback(async (moduleId: string) => {
    try {
      return await moduleApiGateway.isModuleDegraded(moduleId);
    } catch (err) {
      console.error('Error checking module status:', err);
      return false;
    }
  }, []);

  return {
    modules,
    loading,
    error,
    initializeModules,
    refreshModules,
    updateFeatureStatus,
    isModuleDegraded,
  };
}
