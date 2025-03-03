
import { useState, useEffect } from "react";
import { AppModule } from "../types";
import { getFullModulesFromCache } from "../utils";

/**
 * Hook to load modules from cache
 */
export function useCacheLoader(loading: boolean, setLoading: (value: boolean) => void) {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Try to load from cache on startup
  useEffect(() => {
    const loadFromCache = () => {
      const cachedModules = getFullModulesFromCache();
      if (cachedModules && cachedModules.length > 0) {
        console.log("Modules loaded from cache:", cachedModules.length);
        setModules(cachedModules);
        // Set loading to false if we have cached modules
        setTimeout(() => setLoading(false), 500);
      }
    };
    
    loadFromCache();
    
    // Set a timeout to stop loading state after 5 seconds regardless
    const timer = setTimeout(() => {
      if (loading) {
        console.log("Forcing loading state to end after timeout");
        setLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loading, setLoading]);

  return { cachedModules: modules, loadingTimeout };
}
