
/**
 * Utilitaires pour rafraîchir les modules depuis Supabase avec gestion avancée du cache
 */
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "../types";
import { moduleValidator } from "../services/ModuleValidator";
import { moduleCacheService } from "../services/ModuleCacheService";
import { circuitBreakerService } from "../services/CircuitBreakerService";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_EVENTS } from "@/services/modules/ModuleEvents";

/**
 * Rafraîchit les modules directement depuis Supabase et met à jour le cache
 */
export const refreshModulesWithCache = async (
  setModules: React.Dispatch<React.SetStateAction<AppModule[]>>
): Promise<AppModule[]> => {
  try {
    console.log("Chargement des modules directement depuis Supabase");
    
    // Vérifier d'abord le cache
    const cachedModules = moduleCacheService.getModulesFromCache();
    if (cachedModules && cachedModules.length > 0) {
      console.log(`Utilisation temporaire des ${cachedModules.length} modules en cache pendant le chargement`);
      setModules(cachedModules);
    }
    
    // Utiliser le circuit breaker pour éviter les appels répétés en cas d'erreur
    try {
      const modules = await circuitBreakerService.execute('modules_refresh', async () => {
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
                
                // Émettre un événement pour informer les autres composants via le nouveau EventBus
                eventBus.publish(MODULE_EVENTS.MODULES_REFRESHED, {
                  count: typedModules.length,
                  timestamp: Date.now(),
                  source: 'api'
                });
                
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
      }, {
        timeout: 8000, // 8 secondes de timeout pour l'opération complète
        fallback: async () => {
          console.log("Utilisation du fallback pour le chargement des modules");
          const cachedModules = moduleCacheService.getModulesFromCache();
          
          if (cachedModules && cachedModules.length > 0) {
            console.log(`Utilisation des ${cachedModules.length} modules en cache depuis le fallback`);
            
            // Émettre un événement pour informer les autres composants
            eventBus.publish(MODULE_EVENTS.MODULES_REFRESHED, {
              count: cachedModules.length,
              timestamp: Date.now(),
              source: 'cache'
            });
            
            return cachedModules;
          }
          
          throw new Error("Aucun module disponible dans le cache");
        }
      });
      
      return modules;
    } catch (error: any) {
      // Capturer l'erreur du circuit breaker et réessayer avec le cache
      console.error("Erreur du circuit breaker:", error?.message || error);
      
      // Publier un événement d'erreur
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: error?.message || "Erreur inconnue lors du rafraîchissement des modules",
        context: "circuit_breaker",
        timestamp: Date.now(),
        details: error
      });
      
      // Utiliser le cache comme dernier recours
      const cachedModules = moduleCacheService.getModulesFromCache();
      if (cachedModules && cachedModules.length > 0) {
        console.log(`Utilisation des ${cachedModules.length} modules en cache après erreur du circuit breaker`);
        
        // Émettre un événement pour informer les autres composants
        eventBus.publish(MODULE_EVENTS.MODULES_REFRESHED, {
          count: cachedModules.length,
          timestamp: Date.now(),
          source: 'cache'
        });
        
        setModules(cachedModules);
        return cachedModules;
      }
      
      // Si aucun cache disponible, propager l'erreur
      throw error;
    }
  } catch (error: any) {
    console.error("Exception lors du rafraîchissement des modules:", error);
    
    // En cas d'erreur, essayer de lire depuis le cache local
    try {
      const cachedModules = moduleCacheService.getModulesFromCache();
      if (cachedModules && cachedModules.length > 0) {
        console.log(`Utilisation des ${cachedModules.length} modules en cache après erreur`);
        setModules(cachedModules);
        
        // Publier un événement d'erreur via l'Event Bus
        eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
          error: "Erreur lors du rafraîchissement des modules, utilisation du cache",
          context: "refresh",
          timestamp: Date.now()
        });
        
        return cachedModules;
      }
    } catch (e) {
      console.error("Erreur lors de la lecture du cache des modules:", e);
    }
    
    // Si tout échoue, retourner un tableau vide
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
  
  // Publier un événement d'erreur via l'Event Bus
  eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
    error: `Échec après ${maxRetries} tentatives de rafraîchissement des modules`,
    context: "retry",
    timestamp: Date.now(),
    details: lastError
  });
  
  // Utiliser une dernière fois le cache comme filet de sécurité
  const cachedModules = moduleCacheService.getModulesFromCache();
  if (cachedModules && cachedModules.length > 0) {
    console.log(`Utilisation des ${cachedModules.length} modules en cache après échec des tentatives`);
    setModules(cachedModules);
    return cachedModules;
  }
  
  throw lastError || new Error("Échec du rafraîchissement des modules après plusieurs tentatives");
};

/**
 * Exécute une fonction de rafraîchissement des modules et gère les erreurs
 */
export const handleModuleRefresh = async (
  refreshModules: () => Promise<void>
): Promise<void> => {
  try {
    console.log('Starting module refresh process...');
    
    // Exécuter la fonction de rafraîchissement des modules
    await refreshModules();
    console.log('Module refresh completed successfully');
  } catch (error) {
    console.error('Error during module refresh:', error);
    // Erreur gérée ici dans le try/catch
  }
};

/**
 * Exécute une fonction de rafraîchissement des modules en mode sûr
 */
export const safeRefreshModules = async (
  refreshFunction: () => Promise<void>
): Promise<void> => {
  try {
    await handleModuleRefresh(refreshFunction);
  } catch (error) {
    console.error('Safe refresh failed:', error);
  }
};
