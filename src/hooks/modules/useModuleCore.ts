
/**
 * Core functionality for modules system
 * This file contains the main hook for modules management
 */

import { useEffect } from "react";
import { ModuleStatus } from "./types";
import { useModuleDataFetcher } from "./dataFetcher";
import { useStatusManager } from "./statusManager";
import { createModuleSubscriptions } from "./subscriptions";
import { cacheModuleStatuses, getModuleStatusesFromCache } from "./utils";
import { initTabSync, broadcastModuleStatusChange, broadcastFeatureStatusChange, cleanupTabSync } from "./tabSync";
import { supabase } from "@/integrations/supabase/client";
import { combineModulesWithFeatures, checkModuleActive, checkModuleDegraded, checkFeatureEnabled } from "./utils";

// Identifier pour le module Admin qui ne doit jamais être désactivé
const ADMIN_MODULE_CODE = "admin";

/**
 * Hook principal pour la gestion des modules
 * Fournit toutes les fonctions nécessaires pour interagir avec les modules
 */
export const useModuleCore = () => {
  // Récupérer les données des modules et dépendances
  const {
    modules,
    setModules,
    dependencies,
    setDependencies,
    features,
    setFeatures,
    loading,
    error,
    fetchModules,
    fetchDependencies,
    fetchFeatures
  } = useModuleDataFetcher();

  // Obtenir les fonctions de gestion des statuts
  const {
    updateModuleStatus: updateModule,
    updateFeatureStatus: updateFeature,
    updateFeatureStatusSilent: updateFeatureSilent
  } = useStatusManager();

  // Vérifier si un module est actif
  const isModuleActive = (moduleCode: string): boolean => {
    // Si le module est Admin, toujours retourner true
    if (moduleCode === ADMIN_MODULE_CODE) return true;
    
    // Si les modules ne sont pas encore chargés, vérifier le cache local
    if (modules.length === 0) {
      const cachedStatuses = getModuleStatusesFromCache();
      if (cachedStatuses && cachedStatuses[moduleCode]) {
        return cachedStatuses[moduleCode] === 'active';
      }
      return false; // Par défaut, considérer inactif si pas de cache
    }
    
    return checkModuleActive(modules, moduleCode);
  };

  // Vérifier si un module est en mode dégradé
  const isModuleDegraded = (moduleCode: string): boolean => {
    // Si le module est Admin, jamais en mode dégradé
    if (moduleCode === ADMIN_MODULE_CODE) return false;
    
    // Si les modules ne sont pas encore chargés, vérifier le cache local
    if (modules.length === 0) {
      const cachedStatuses = getModuleStatusesFromCache();
      if (cachedStatuses && cachedStatuses[moduleCode]) {
        return cachedStatuses[moduleCode] === 'degraded';
      }
      return false; // Par défaut, considérer non-dégradé si pas de cache
    }
    
    return checkModuleDegraded(modules, moduleCode);
  };

  // Vérifier si une fonctionnalité spécifique d'un module est activée
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    // Si le module est Admin, toujours activer ses fonctionnalités
    if (moduleCode === ADMIN_MODULE_CODE) return true;
    
    return checkFeatureEnabled(modules, features, moduleCode, featureCode);
  };

  // Configurer les abonnements temps réel et initialiser le système
  useEffect(() => {
    // Initialize tab synchronization
    initTabSync();
    
    // Charger les données initiales
    Promise.all([fetchModules(), fetchDependencies(), fetchFeatures()]).then(([modulesData]) => {
      // Mettre en cache les données des modules pour un accès rapide
      if (modulesData && modulesData.length > 0) {
        cacheModuleStatuses(modulesData);
      }
    });
    
    // Configurer les abonnements temps réel
    const { cleanup } = createModuleSubscriptions({
      onModuleChange: (payload) => {
        console.log('Module changed, refreshing data:', payload);
        
        // Vérifier si c'est le module Admin qui est désactivé via Supabase Realtime
        // Si oui, on recharge immédiatement pour forcer sa réactivation
        if (payload?.new?.code === ADMIN_MODULE_CODE && payload?.new?.status !== 'active') {
          console.warn("Tentative de désactivation du module Admin détectée. Réactivation en cours...");
          supabase
            .from('app_modules')
            .update({ 
              status: 'active', 
              updated_at: new Date().toISOString() 
            })
            .eq('id', payload.new.id)
            .then(() => {
              console.log("Module Admin réactivé avec succès");
              fetchModules();
            });
        } else {
          fetchModules().then(newModules => {
            // Mettre à jour le cache
            if (newModules && newModules.length > 0) {
              cacheModuleStatuses(newModules);
            }
            
            // Si un module a été mis à jour en 'inactive', vérifier les impacts sur les features
            if (payload?.eventType === 'UPDATE' && payload?.new?.status === 'inactive') {
              const moduleCode = newModules.find(m => m.id === payload.new.id)?.code;
              if (moduleCode) {
                // Rafraîchir les features également
                fetchFeatures();
              }
            }
          });
        }
      },
      onFeatureChange: (payload) => {
        console.log('Feature changed, refreshing data:', payload);
        
        // Vérifier si c'est une fonctionnalité du module Admin qui est désactivée
        if (payload?.new?.module_code === ADMIN_MODULE_CODE && !payload?.new?.is_enabled) {
          console.warn("Tentative de désactivation d'une fonctionnalité Admin détectée. Réactivation en cours...");
          supabase
            .from('module_features')
            .update({ 
              is_enabled: true, 
              updated_at: new Date().toISOString() 
            })
            .eq('id', payload.new.id)
            .then(() => {
              console.log("Fonctionnalité Admin réactivée avec succès");
              fetchFeatures();
            });
        } else {
          fetchFeatures().then(newFeatures => {
            // Mettre à jour les modules avec les nouvelles valeurs
            if (modules.length > 0) {
              const updatedModules = combineModulesWithFeatures(modules, newFeatures);
              setModules(updatedModules);
              // Mettre à jour le cache
              cacheModuleStatuses(updatedModules);
            }
          });
        }
      },
      onDependencyChange: (payload) => {
        console.log('Dependency changed, refreshing data:', payload);
        fetchDependencies().then(() => {
          // Vérifier si des modules sont impactés par ce changement de dépendance
          fetchModules().then(newModules => {
            // Mettre à jour le cache
            if (newModules && newModules.length > 0) {
              cacheModuleStatuses(newModules);
            }
          });
        });
      }
    });

    // Nettoyer les abonnements à la destruction du composant
    return () => {
      cleanup();
      cleanupTabSync();
    };
  }, []);

  return {
    modules,
    dependencies,
    loading,
    error,
    features,
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    updateModule,
    updateFeature,
    updateFeatureSilent,
    fetchModules,
    fetchDependencies,
    fetchFeatures,
    setModules
  };
};
