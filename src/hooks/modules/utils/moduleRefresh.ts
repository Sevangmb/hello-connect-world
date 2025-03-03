
/**
 * Utilitaires pour rafraîchir les modules depuis Supabase avec gestion avancée du cache
 */
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "../types";
import { moduleValidator } from "../services/ModuleValidator";
import { moduleCacheService } from "../services/ModuleCacheService";
import { circuitBreakerService } from "../services/CircuitBreakerService";

/**
 * Rafraîchit les modules directement depuis Supabase et met à jour le cache
 */
export const refreshModulesWithCache = async (setModules: React.Dispatch<React.SetStateAction<AppModule[]>>): Promise<AppModule[]> => {
  try {
    console.log("Chargement des modules directement depuis Supabase");
    
    // Vérifier d'abord le cache
    const cachedModules = moduleCacheService.getModulesFromCache();
    if (cachedModules && cachedModules.length > 0) {
      console.log(`Utilisation temporaire des ${cachedModules.length} modules en cache pendant le chargement`);
      setModules(cachedModules);
    }
    
    // Utiliser le circuit breaker pour éviter les appels répétés en cas d'erreur
    return await circuitBreakerService.execute('modules_refresh', async () => {
      // Création d'une nouvelle Promise pour gérer correctement les types et le timeout
      return new Promise<AppModule[]>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Timeout lors du chargement des modules"));
        }, 5000); // 5 secondes timeout

        supabase
          .from('app_modules')
          .select('*')
          .order('name')
          .then(({ data, error }) => {
            clearTimeout(timeoutId);
            
            if (error) {
              console.error("Erreur lors du chargement des modules:", error);
              reject(error);
              return;
            }
            
            if (data && data.length > 0) {
              // Assurer que les statuts sont des ModuleStatus valides
              const typedModules = data.map(module => {
                // Utiliser le validateur pour s'assurer que le statut est valide
                const status = moduleValidator.validateModuleStatus(module.status);
                return { ...module, status } as AppModule;
              });
              
              // Mettre à jour l'état
              setModules(typedModules);
              
              // Mettre à jour le cache
              moduleCacheService.cacheModules(typedModules);
              
              console.log(`${typedModules.length} modules chargés depuis Supabase et mis en cache`);
              
              // Émettre un événement pour informer les autres composants
              window.dispatchEvent(new CustomEvent('modules_updated'));
              
              resolve(typedModules);
            } else {
              resolve([]);
            }
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            reject(error);
          });
      });
    });
  } catch (error) {
    console.error("Exception lors du rafraîchissement des modules:", error);
    
    // En cas d'erreur, essayer de lire depuis le cache local
    try {
      const cachedModules = moduleCacheService.getModulesFromCache();
      if (cachedModules && cachedModules.length > 0) {
        console.log(`Utilisation des ${cachedModules.length} modules en cache après erreur`);
        setModules(cachedModules);
        return cachedModules;
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
