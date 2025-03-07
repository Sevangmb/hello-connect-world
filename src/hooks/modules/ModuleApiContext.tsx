
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

// Cache système pour éviter les requêtes redondantes
const moduleCache = new Map<string, {data: AppModule[], timestamp: number}>();
const CACHE_TTL = 120000; // 2 minutes

// Function to fetch all modules with caching
export const fetchAllModules = async (force: boolean = false): Promise<AppModule[]> => {
  const cacheKey = 'all_modules';
  
  // Use cache if available and not forced refresh
  if (!force && moduleCache.has(cacheKey)) {
    const cachedData = moduleCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
      console.log('Using cached modules');
      return cachedData.data;
    }
  }
  
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Update cache
    if (data && data.length > 0) {
      moduleCache.set(cacheKey, {
        data: data as AppModule[],
        timestamp: Date.now()
      });
    }
    
    return data as AppModule[];
  } catch (err) {
    console.error('Error fetching modules:', err);
    
    // Return cached data if available, even if expired
    if (moduleCache.has(cacheKey)) {
      console.log('Returning expired cached modules due to error');
      const cachedData = moduleCache.get(cacheKey);
      return cachedData?.data || [];
    }
    
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
  const initialLoadAttemptedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Function to handle errors
  const handleError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('Module API error:', errorMessage);
    if (isMountedRef.current) {
      setError(errorMessage);
    }
  };

  // Fetch modules from the API
  const fetchModules = useCallback(async (force: boolean = false) => {
    if (loading) return modules; // Prevent concurrent fetches
    
    setLoading(true);
    try {
      const fetchedModules = await fetchAllModules(force);
      if (isMountedRef.current) {
        setModules(fetchedModules);
        setError(null);
      }
      return fetchedModules;
    } catch (err) {
      handleError(err);
      return modules;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [modules, loading]);

  // Fetch features from the API
  const fetchFeatures = useCallback(async () => {
    if (loading) return features; // Prevent concurrent fetches
    
    setLoading(true);
    try {
      const fetchedFeatures = await fetchAllFeatures();
      if (isMountedRef.current) {
        setFeatures(fetchedFeatures);
        setError(null);
      }
      return fetchedFeatures;
    } catch (err) {
      handleError(err);
      return features;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [features, loading]);

  // Refresh modules and features
  const refreshModules = useCallback(async (force: boolean = false) => {
    const modules = await fetchModules(force);
    if (isMountedRef.current) {
      setIsInitialized(true);
    }
    return modules;
  }, [fetchModules]);

  const refreshFeatures = useCallback(async () => {
    await fetchFeatures();
    return;
  }, [fetchFeatures]);

  // Load modules and features on component mount, mais une seule fois
  useEffect(() => {
    isMountedRef.current = true;
    
    // Éviter les initialisations multiples
    if (initialLoadAttemptedRef.current) return;
    initialLoadAttemptedRef.current = true;
    
    const init = async () => {
      try {
        await refreshModules();
        await refreshFeatures();
        if (isMountedRef.current) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation des modules:", error);
        if (isMountedRef.current) {
          setIsInitialized(true); // Mark as initialized even on error to prevent loops
        }
      }
    };
    
    init();
    
    return () => {
      isMountedRef.current = false;
    };
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
