
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "../types";

/**
 * Rafraîchit les modules directement depuis Supabase et met à jour le cache
 */
export const refreshModulesWithCache = async (setModules: React.Dispatch<React.SetStateAction<AppModule[]>>): Promise<AppModule[]> => {
  try {
    console.log("Chargement des modules directement depuis Supabase");
    
    const { data, error } = await supabase
      .from('app_modules')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Erreur lors du chargement des modules:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      // Assurer que les statuts sont des ModuleStatus valides
      const typedModules = data.map(module => {
        let status = module.status;
        // S'assurer que le statut est un ModuleStatus valide
        if (status !== 'active' && status !== 'inactive' && status !== 'degraded') {
          status = 'inactive';
        }
        return { ...module, status } as AppModule;
      });
      
      // Mettre à jour l'état
      setModules(typedModules);
      
      // Mettre à jour le cache localStorage
      try {
        localStorage.setItem('modules_cache', JSON.stringify(typedModules));
        localStorage.setItem('modules_cache_timestamp', Date.now().toString());
      } catch (e) {
        console.error("Erreur lors de la mise en cache des modules:", e);
      }
      
      console.log(`${typedModules.length} modules chargés depuis Supabase et mis en cache`);
      return typedModules;
    }
    
    return [];
  } catch (error) {
    console.error("Exception lors du rafraîchissement des modules:", error);
    return [];
  }
};
