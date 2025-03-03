
import { useState } from "react";
import { ModuleDataFetcherReturn, ConnectionStatus } from "./types";
import { AppModule, ModuleDependency } from "../types";
import { useConnectionChecker } from "./connectionChecker";
import { useCacheLoader } from "./cacheLoader";
import { useModuleFetcher } from "./moduleFetcher";
import { fetchDependencies } from "./dependencyFetcher";
import { fetchFeatures } from "./featureFetcher";

export type { ConnectionStatus } from "./types";

/**
 * Main hook for fetching module data with caching and error handling
 */
export function useModuleDataFetcher(): ModuleDataFetcherReturn {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [dependencies, setDependencies] = useState<ModuleDependency[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');

  // Check connection to Supabase
  const { connectionStatus: checkerConnectionStatus, error: connectionError } = useConnectionChecker();
  
  // Update our local connection status based on the checker
  if (checkerConnectionStatus !== connectionStatus) {
    setConnectionStatus(checkerConnectionStatus);
  }
  
  if (connectionError && !error) {
    setError(connectionError);
  }

  // Try to load from cache on startup
  const { cachedModules } = useCacheLoader(loading, setLoading);
  if (cachedModules.length > 0 && modules.length === 0) {
    setModules(cachedModules);
  }

  // Set up module fetcher
  const { fetchModules: fetchModulesCore } = useModuleFetcher(
    modules, 
    features, 
    setConnectionStatus  // Pass the setter function to useModuleFetcher
  );

  /**
   * Public API: Fetch all modules
   */
  const fetchModules = async (): Promise<AppModule[]> => {
    try {
      setLoading(true);
      const modulesData = await fetchModulesCore();
      setModules(modulesData);
      setLoading(false);
      return modulesData;
    } catch (err: any) {
      console.error("Error in fetchModules:", err);
      setError(err.message || "Failed to fetch modules");
      setLoading(false);
      return modules.length > 0 ? modules : [];
    } finally {
      // Make sure loading is set to false regardless
      setTimeout(() => setLoading(false), 1000);
    }
  };

  /**
   * Public API: Fetch all dependencies
   */
  const fetchDependenciesWrapper = async (): Promise<ModuleDependency[]> => {
    try {
      setLoading(true);
      const dependenciesData = await fetchDependencies();
      setDependencies(dependenciesData);
      return dependenciesData;
    } catch (err: any) {
      console.error("Error in fetchDependencies:", err);
      setError(err.message || "Failed to fetch dependencies");
      return dependencies.length > 0 ? dependencies : [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Public API: Fetch all feature flags
   */
  const fetchFeaturesWrapper = async () => {
    try {
      setLoading(true);
      const featuresData = await fetchFeatures();
      setFeatures(featuresData);
      return featuresData;
    } catch (err: any) {
      console.error("Error in fetchFeatures:", err);
      setError(err.message || "Failed to fetch features");
      return features;
    } finally {
      setLoading(false);
    }
  };

  return {
    modules,
    setModules,
    dependencies,
    setDependencies,
    features,
    setFeatures,
    loading,
    error,
    fetchModules,
    fetchDependencies: fetchDependenciesWrapper,
    fetchFeatures: fetchFeaturesWrapper,
    connectionStatus
  };
}
