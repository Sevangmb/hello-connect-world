
/**
 * Service responsable de l'initialisation des modules
 */
import { AppModule } from "../types";
import { supabase } from "@/integrations/supabase/client";

// Références globales pour le suivi de l'état d'initialisation
export const initAttemptRef = { current: 0 };
export const isMountedRef = { current: true };
export const initialLoadAttemptedRef = { current: false };

/**
 * Charge les modules depuis le localStorage
 */
export const loadModulesFromLocalStorage = (): AppModule[] => {
  try {
    const cachedModulesData = localStorage.getItem('modules_cache');
    if (cachedModulesData) {
      const parsedCache = JSON.parse(cachedModulesData);
      const now = Date.now();
      const validCachedModules: AppModule[] = [];
      
      // Vérifier chaque module dans le cache
      Object.entries(parsedCache).forEach(([, moduleData]: [string, any]) => {
        if (moduleData.timestamp && (now - moduleData.timestamp < 300000)) { // 5 minutes
          if (moduleData.data) {
            validCachedModules.push(moduleData.data);
          }
        }
      });
      
      if (validCachedModules.length > 0) {
        console.log("Modules chargés depuis le cache local:", validCachedModules.length);
        return validCachedModules;
      }
    }
  } catch (e) {
    console.error("Erreur lors du chargement du cache local:", e);
  }
  
  return [];
};

/**
 * Tente de charger les modules directement depuis Supabase
 * comme mécanisme de secours
 */
export const loadModulesFromSupabase = async (): Promise<AppModule[]> => {
  try {
    const { data } = await supabase
      .from('app_modules')
      .select('*')
      .order('name');
      
    if (data && data.length > 0) {
      // Ensure we have proper ModuleStatus types
      const typedModules = data.map(module => {
        let status = module.status;
        // Make sure status is a valid ModuleStatus
        if (status !== 'active' && status !== 'inactive' && status !== 'degraded') {
          status = 'inactive';
        }
        return { ...module, status } as AppModule;
      });
      
      console.log("Modules chargés via fetch de secours:", typedModules.length);
      return typedModules;
    }
  } catch (e) {
    console.error("Erreur lors du fetch de secours:", e);
  }
  
  return [];
};

/**
 * Sauvegarde les modules dans le localStorage
 */
export const saveModulesToLocalStorage = (modules: AppModule[]): void => {
  try {
    const moduleData: Record<string, { data: AppModule, timestamp: number }> = {};
    
    modules.forEach(module => {
      moduleData[module.code] = {
        data: module,
        timestamp: Date.now()
      };
    });
    
    localStorage.setItem('modules_cache', JSON.stringify(moduleData));
    localStorage.setItem('modules_cache_time', Date.now().toString());
  } catch (storageErr) {
    console.warn("Could not save modules to localStorage:", storageErr);
  }
};
