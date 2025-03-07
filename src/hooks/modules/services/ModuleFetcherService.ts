
/**
 * Service responsable du chargement des modules
 */
import { AppModule } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { initAttemptRef } from "./ModuleInitializationService";
import { getModulesFromCache, updateModulesCache } from "./ModuleCacheService";

/**
 * Charge les modules avec mise en cache
 */
export const fetchModulesWithCache = async (
  force: boolean = false,
  existingModules: AppModule[] = []
): Promise<AppModule[]> => {
  const cacheKey = 'all_modules';
  
  // Vérifier le cache sauf si force est true
  if (!force) {
    const cachedModules = getModulesFromCache(cacheKey);
    if (cachedModules) {
      console.log('Utilisation des modules depuis le cache en mémoire');
      return cachedModules;
    }
  }
  
  // Limiter les tentatives de rechargement
  if (initAttemptRef.current > 3 && !force) {
    console.log('Trop de tentatives de chargement, utilisation des modules existants');
    if (existingModules.length > 0) return existingModules;
  }
  
  initAttemptRef.current += 1;
  
  try {
    // Récupérer les données
    const { data, error } = await supabase
      .from('app_modules')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
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
      
      // Mettre à jour le cache
      updateModulesCache(cacheKey, typedModules);
      return typedModules;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des modules:", error);
  }
  
  // En cas d'erreur, retourner les modules existants
  return existingModules;
};

/**
 * Charge les modules depuis l'API des modules
 */
export const fetchModulesFromApi = async (
  moduleApi: any,
  forceRefresh: boolean = false
): Promise<AppModule[]> => {
  try {
    return await moduleApi.refreshModules(forceRefresh);
  } catch (error) {
    console.error("Erreur lors du chargement des modules depuis l'API:", error);
    return [];
  }
};
