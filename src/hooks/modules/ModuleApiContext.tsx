
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppModule } from './types';
import { supabase } from '@/integrations/supabase/client';

// Define the context type
export interface ModuleApiContextType {
  modules: AppModule[];
  features: Record<string, any>;
  loading: boolean;
  error: string | null;
  refreshModules: (force?: boolean) => Promise<AppModule[]>;
  refreshFeatures: () => Promise<void>;
  isInitialized: boolean;
}

// Create the context with a default value
const ModuleApiContext = createContext<ModuleApiContextType>({
  modules: [],
  features: {},
  loading: false,
  error: null,
  refreshModules: async () => [],
  refreshFeatures: async () => {},
  isInitialized: false,
});

// Custom hook to use the module API context
export function useModuleApi() {
  return useContext(ModuleApiContext);
}

// Alias for backward compatibility - export both to support existing code
export const useModuleApiContext = useModuleApi;

// Function to fetch all modules
export const fetchAllModules = async (): Promise<AppModule[]> => {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data as AppModule[];
  } catch (err) {
    console.error('Error fetching modules:', err);
    return [];
  }
};

// Function to fetch all features
export const fetchAllFeatures = async (): Promise<Record<string, any>> => {
  try {
    const { data, error } = await supabase
      .from('module_features')
      .select('*');
    
    if (error) throw error;
    
    // Organize by module_code
    const features: Record<string, any> = {};
    data.forEach(feature => {
      if (!features[feature.module_code]) {
        features[feature.module_code] = {};
      }
      features[feature.module_code][feature.feature_code] = feature.is_enabled;
    });
    
    return features;
  } catch (err) {
    console.error('Error fetching features:', err);
    return {};
  }
};

// Provider component to wrap the app and provide the context
export function ModuleApiContextProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [features, setFeatures] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to handle errors
  const handleError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('Module API error:', errorMessage);
    setError(errorMessage);
  };

  // Fetch modules from the API
  const fetchModules = useCallback(async (force: boolean = false) => {
    setLoading(true);
    try {
      const fetchedModules = await fetchAllModules();
      setModules(fetchedModules);
      setError(null);
      return fetchedModules;
    } catch (err) {
      handleError(err);
      return [];
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
      return fetchedFeatures;
    } catch (err) {
      handleError(err);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh modules and features
  const refreshModules = useCallback(async (force: boolean = false) => {
    const modules = await fetchModules(force);
    setIsInitialized(true);
    return modules;
  }, [fetchModules]);

  const refreshFeatures = useCallback(async () => {
    await fetchFeatures();
    return;
  }, [fetchFeatures]);

  // Load modules and features on component mount
  useEffect(() => {
    const init = async () => {
      await refreshModules();
      await refreshFeatures();
      setIsInitialized(true);
    };
    
    init();
  }, [refreshModules, refreshFeatures]);

  return (
    <ModuleApiContext.Provider
      value={{
        modules,
        features,
        loading,
        error,
        refreshModules,
        refreshFeatures,
        isInitialized,
      }}
    >
      {children}
    </ModuleApiContext.Provider>
  );
}
