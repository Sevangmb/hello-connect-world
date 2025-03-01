
/**
 * Fonctions pour rafraîchir les modules depuis Supabase
 */

import { supabase } from "@/integrations/supabase/client";
import { AppModule } from "../types";
import { validateModuleStatus } from "./statusValidation";
import { invalidateAllCache } from "../cache/moduleCache";

/**
 * Charge les modules directement depuis Supabase
 */
export const loadModulesFromSupabase = async (): Promise<AppModule[]> => {
  console.log("Tentative de chargement direct depuis Supabase");
  try {
    const { data, error } = await supabase.from('app_modules').select('*');
    
    if (error) {
      console.error("Erreur lors du chargement direct des modules:", error);
      return [];
    }
    
    if (data && data.length > 0) {
      console.log(`${data.length} modules chargés directement depuis Supabase`);
      // Convertir explicitement les statuts en ModuleStatus
      const validatedModules = data.map(module => ({
        ...module,
        status: validateModuleStatus(module.status)
      }));
      
      // Marquer tous les modules comme actifs pour la compatibilité
      const activatedModules = validatedModules.map(module => ({
        ...module,
        status: 'active' as const
      }));
      
      return activatedModules;
    }
  } catch (e) {
    console.error("Exception lors du chargement direct depuis Supabase:", e);
  }
  
  return [];
};

/**
 * Rafraîchit les modules avec gestion du cache
 */
export const refreshModulesWithCache = async (
  setModules: (modules: AppModule[]) => void
): Promise<AppModule[]> => {
  console.log("useModules: Forçage du rafraîchissement des modules");
  
  // Invalider tous les caches
  invalidateAllCache();
  
  const updatedModules = await loadModulesFromSupabase();
  console.log(`useModules: ${updatedModules.length} modules récupérés`);
  
  if (updatedModules.length > 0) {
    setModules(updatedModules);
  }
  
  return updatedModules;
};
