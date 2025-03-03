
import { useState } from "react";
import { AppModule } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { combineModulesWithFeatures } from "../utils";

/**
 * Fetches modules with fallback mechanisms
 */
export function useModuleFetcher(
  modules: AppModule[],
  features: Record<string, Record<string, boolean>>,
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'checking') => void
) {
  const [fetchAttempts, setFetchAttempts] = useState(0);

  /**
   * Fetch all modules from the API
   */
  const fetchModules = async (): Promise<AppModule[]> => {
    try {
      setFetchAttempts(prev => prev + 1);
      
      // If after several attempts, still no results, try an alternative method
      if (fetchAttempts > 2) {
        console.log("Alternative attempt to load modules after previous failures");
        try {
          // Try to load directly via Supabase
          const { data: directData, error: directError } = await supabase
            .from('app_modules')
            .select('*')
            .order('name');
            
          if (!directError && directData && directData.length > 0) {
            console.log("Modules loaded via alternative method:", directData.length);
            
            // Convert statuses to valid ModuleStatus
            const typedModules = directData.map(module => {
              let status = module.status;
              // Make sure status is a valid ModuleStatus
              if (status !== 'active' && status !== 'inactive' && status !== 'degraded') {
                status = 'inactive';
              }
              return { ...module, status } as AppModule;
            });
            
            // If we already have features, combine them with the modules
            if (Object.keys(features).length > 0) {
              return combineModulesWithFeatures(typedModules, features);
            } else {
              return typedModules;
            }
          } else if (directError) {
            console.error("Error during direct loading:", directError);
            setConnectionStatus('disconnected');
            throw new Error(directError.message || "Failed to load modules");
          }
        } catch (altErr) {
          console.error("Error during alternative module loading:", altErr);
        }
      }
      
      // Main method via Supabase direct query
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');
        
      if (error) {
        console.error("Error fetching modules:", error);
        setConnectionStatus('disconnected');
        throw new Error(error.message || "Failed to fetch modules");
      }
      
      // Convert statuses to valid ModuleStatus
      const typedModules = (data || []).map(module => {
        let status = module.status;
        // Make sure status is a valid ModuleStatus
        if (status !== 'active' && status !== 'inactive' && status !== 'degraded') {
          status = 'inactive';
        }
        return { ...module, status } as AppModule;
      });
      
      // If we already have features, combine them with modules
      if (Object.keys(features).length > 0) {
        return combineModulesWithFeatures(typedModules, features);
      } else {
        return typedModules;
      }
    } catch (err: any) {
      console.error("Error fetching modules:", err);
      
      // In case of error, return cached modules or empty array
      return modules.length > 0 ? modules : [];
    }
  };

  return { fetchModules };
}
