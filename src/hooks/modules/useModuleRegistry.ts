
import { useState, useEffect } from 'react';
import { ModuleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { AppModule } from './types';

const moduleApi = new ModuleApiGateway();

export const useModuleRegistry = () => {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        const allModules = await moduleApi.getAllModules();
        setModules(allModules);
      } catch (err) {
        console.error('Error loading modules:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  return { modules, loading, error };
};
