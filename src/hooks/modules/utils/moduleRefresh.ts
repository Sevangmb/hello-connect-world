
import { supabase } from "@/integrations/supabase/client";
import { AppModule } from "../types";

/**
 * Refreshes modules with cache fallback
 * @param setModules Function to set modules in state
 */
export const refreshModulesWithCache = async (
  setModules: (modules: AppModule[]) => void
): Promise<void> => {
  console.log("Refreshing modules with cache fallback");
  
  try {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from("app_modules")
      .select("*")
      .order("name");
      
    if (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log("Modules fetched from Supabase:", data.length);
      
      // Convert to AppModule type and ensure valid status
      const formattedModules = data.map(module => {
        let status = module.status;
        // Validate status
        if (status !== "active" && status !== "inactive" && status !== "degraded") {
          status = "inactive";
        }
        return { ...module, status } as AppModule;
      });
      
      // Update state
      setModules(formattedModules);
      
      // Save to localStorage for offline fallback
      try {
        localStorage.setItem("cached_modules", JSON.stringify(formattedModules));
        localStorage.setItem("modules_cache_time", Date.now().toString());
      } catch (storageErr) {
        console.warn("Could not save modules to localStorage:", storageErr);
      }
      
      return;
    }
  } catch (error) {
    console.error("Error refreshing modules:", error);
    // Continue to fallback methods
  }
  
  // If we get here, try to load from localStorage
  try {
    const cachedModules = localStorage.getItem("cached_modules");
    if (cachedModules) {
      const modules = JSON.parse(cachedModules) as AppModule[];
      console.log("Using cached modules from localStorage:", modules.length);
      setModules(modules);
      return;
    }
  } catch (cacheError) {
    console.error("Error loading cached modules:", cacheError);
  }
  
  // Final fallback: If all else fails, use hardcoded minimal core modules
  console.log("Using fallback core modules");
  setModules([
    {
      id: "core-1",
      name: "Core",
      code: "core",
      status: "active",
      is_core: true,
      description: "Core functionality"
    } as AppModule
  ]);
};

/**
 * Checks if modules cache is stale
 */
export const isModulesCacheStale = (maxAgeMinutes: number): boolean => {
  try {
    const cacheTimeStr = localStorage.getItem("modules_cache_time");
    if (!cacheTimeStr) return true;
    
    const cacheTime = parseInt(cacheTimeStr, 10);
    const now = Date.now();
    const ageMinutes = (now - cacheTime) / (1000 * 60);
    
    return ageMinutes > maxAgeMinutes;
  } catch (error) {
    return true;
  }
};
