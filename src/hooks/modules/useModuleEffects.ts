
/**
 * Hook spécialisé pour gérer les effets et abonnements des modules
 */

import { useEffect } from "react";
import { AppModule } from "./types";
import { cacheModuleStatuses } from "./utils";
import { createModuleSubscriptions } from "./subscriptions";
import { initTabSync, cleanupTabSync } from "./tabSync";
import { supabase } from "@/integrations/supabase/client";
import { combineModulesWithFeatures } from "./utils";

// Identifier pour le module Admin qui ne doit jamais être désactivé
const ADMIN_MODULE_CODE = "admin";

export const useModuleEffects = (
  modules: AppModule[],
  setModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
  fetchModules: () => Promise<AppModule[]>,
  fetchDependencies: () => Promise<any[]>,
  fetchFeatures: () => Promise<Record<string, Record<string, boolean>>>
) => {
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
};
