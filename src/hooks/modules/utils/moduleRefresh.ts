
import { supabase } from "@/integrations/supabase/client";
import { AppModule } from "../types";
import { MENU_MODULE_CODE } from "../constants";

/**
 * Refreshes modules with cache fallback
 * @param setModules Function to set modules in state
 */
export const refreshModulesWithCache = async (
  setModules: (modules: AppModule[]) => void
): Promise<AppModule[]> => {
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
      
      return formattedModules;
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
      return modules;
    }
  } catch (cacheError) {
    console.error("Error loading cached modules:", cacheError);
  }
  
  // Final fallback: If all else fails, use hardcoded minimal core modules
  console.log("Using fallback core modules");
  const fallbackModules = [
    {
      id: "core-1",
      name: "Core",
      code: "core",
      status: "active",
      is_core: true,
      description: "Core functionality"
    } as AppModule,
    {
      id: "menu-1",
      name: "Menu",
      code: MENU_MODULE_CODE,
      status: "active",
      is_core: true,
      description: "Application menu system"
    } as AppModule
  ];
  setModules(fallbackModules);
  return fallbackModules;
};

/**
 * Refreshes modules with retry mechanism
 * @param setModules Function to set modules in state
 * @param maxRetries Maximum number of retries
 */
export const refreshModulesWithRetry = async (
  setModules: (modules: AppModule[]) => void,
  maxRetries: number = 3
): Promise<AppModule[]> => {
  console.log("Refreshing modules with retry mechanism");
  
  let retries = 0;
  let lastError: Error | null = null;
  
  while (retries < maxRetries) {
    try {
      return await refreshModulesWithCache(setModules);
    } catch (error) {
      retries++;
      lastError = error as Error;
      console.error(`Retry ${retries}/${maxRetries} failed:`, error);
      
      if (retries < maxRetries) {
        // Exponential backoff
        const delay = 1000 * Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If all retries fail, use fallback
  console.error(`All ${maxRetries} retries failed, using fallback modules`);
  
  if (lastError) {
    console.error("Last error:", lastError);
  }
  
  const fallbackModules = [
    {
      id: "core-1",
      name: "Core",
      code: "core",
      status: "active",
      is_core: true,
      description: "Core functionality"
    } as AppModule,
    {
      id: "menu-1",
      name: "Menu",
      code: MENU_MODULE_CODE,
      status: "active",
      is_core: true,
      description: "Application menu system"
    } as AppModule
  ];
  
  setModules(fallbackModules);
  return fallbackModules;
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
