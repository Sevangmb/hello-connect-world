import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppModule } from './types';
import { fetchAllModules, fetchAllFeatures } from '../api/moduleSync';

// Define the context type
export interface ModuleApiContextType {
  modules: AppModule[];
  features: Record<string, any>;
  loading: boolean;
  error: string | null;
  refreshModules: () => Promise<void>;
  refreshFeatures: () => Promise<void>;
}

// Create the context with a default value
const ModuleApiContext = createContext<ModuleApiContextType>({
  modules: [],
  features: {},
  loading: false,
  error: null,
  refreshModules: async () => {},
  refreshFeatures: async () => {},
});

// Custom hook to use the module API context
export function useModuleApi() {
  return useContext(ModuleApiContext);
}

// Provider component to wrap the app and provide the context
export function ModuleApiContextProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [features, setFeatures] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle errors
  const handleError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('Module API error:', errorMessage);
    setError(errorMessage);
  };

  // Fetch modules from the API
  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedModules = await fetchAllModules();
      setModules(fetchedModules);
      setError(null);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch features from the API
  const fetchFeatures = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedFeatures = await fetchAllFeatures();
      setFeatures(fetchedFeatures);
      setError(null);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh modules and features
  const refreshModules = useCallback(async () => {
    await fetchModules();
  }, [fetchModules]);

  const refreshFeatures = useCallback(async () => {
    await fetchFeatures();
  }, [fetchFeatures]);

  // Load modules and features on component mount
  useEffect(() => {
    fetchModules();
    fetchFeatures();
  }, [fetchModules, fetchFeatures]);

  return (
    <ModuleApiContext.Provider
      value={{
        modules,
        features,
        loading,
        error,
        refreshModules,
        refreshFeatures,
      }}
    >
      {children}
    </ModuleApiContext.Provider>
  );
}
