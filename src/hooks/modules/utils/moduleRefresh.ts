
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "../types";

/**
 * Rafraîchit les modules directement depuis Supabase et met à jour le cache
 */
export const refreshModulesWithCache = async (setModules: React.Dispatch<React.SetStateAction<AppModule[]>>): Promise<AppModule[]> => {
  try {
    console.log("Chargement des modules directement depuis Supabase");
    
    // Optimisation: Utilisation d'un timeout pour éviter des requêtes infinies
    const fetchPromise = new Promise<{data: any[], error: any}>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Timeout lors du chargement des modules"));
      }, 5000); // 5 secondes timeout

      // Use a proper try/catch structure with async/await instead of promise.catch
      supabase
        .from('app_modules')
        .select('*')
        .order('name')
        .then((result) => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
    
    try {
      const { data, error } = await fetchPromise;
        
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
          console.log(`${typedModules.length} modules chargés depuis Supabase et mis en cache`);
          
          // Émettre un événement pour informer les autres composants
          window.dispatchEvent(new CustomEvent('modules_updated'));
        } catch (e) {
          console.error("Erreur lors de la mise en cache des modules:", e);
        }
        
        return typedModules;
      }
      return [];
    } catch (fetchError) {
      console.error("Erreur lors de la requête Supabase:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("Exception lors du rafraîchissement des modules:", error);
    // En cas d'erreur, essayer de lire depuis le cache local
    try {
      const cachedData = localStorage.getItem('modules_cache');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as AppModule[];
        console.log(`Utilisation des ${parsedData.length} modules en cache après erreur`);
        setModules(parsedData);
        return parsedData;
      }
    } catch (e) {
      console.error("Erreur lors de la lecture du cache des modules:", e);
    }
    return [];
  }
};

/**
 * Rafraîchir les modules avec une stratégie de backoff exponentiel
 */
export const refreshModulesWithRetry = async (
  setModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
  maxRetries = 3
): Promise<AppModule[]> => {
  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxRetries) {
    try {
      const modules = await refreshModulesWithCache(setModules);
      if (modules.length > 0) {
        return modules;
      }
      // Si nous n'avons pas d'erreur mais pas de modules non plus, on continue avec un backoff
      attempt++;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    } catch (error) {
      console.error(`Tentative ${attempt + 1}/${maxRetries} échouée:`, error);
      lastError = error;
      attempt++;
      // Attendre plus longtemps entre chaque tentative (backoff exponentiel)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  console.error(`Échec après ${maxRetries} tentatives de rafraîchissement des modules`, lastError);
  throw lastError || new Error("Échec du rafraîchissement des modules après plusieurs tentatives");
};
