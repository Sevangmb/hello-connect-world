
import { useEffect } from "react";
import { checkModuleActive, checkModuleDegraded, checkFeatureEnabled } from "./utils";
import { ModuleStatus } from "./types";
import { useModuleDataFetcher } from "./dataFetcher";
import { useStatusManager } from "./statusManager";
import { createModuleSubscriptions } from "./subscriptions";
import { combineModulesWithFeatures } from "./utils";
import { initTabSync, broadcastModuleStatusChange, broadcastFeatureStatusChange, cleanupTabSync } from "./tabSync";

export const useModules = () => {
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
    return checkModuleActive(modules, moduleCode);
  };

  // Vérifier si un module est en mode dégradé
  const isModuleDegraded = (moduleCode: string): boolean => {
    return checkModuleDegraded(modules, moduleCode);
  };

  // Vérifier si une fonctionnalité spécifique d'un module est activée
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    return checkFeatureEnabled(modules, features, moduleCode, featureCode);
  };

  // Mettre à jour l'état d'un module (pour les admins)
  const updateModuleStatus = async (moduleId: string, status: ModuleStatus) => {
    await updateModule(moduleId, status, modules, setModules);
    
    // Broadcast the change to other tabs
    broadcastModuleStatusChange(moduleId, status);
  };

  // Mettre à jour l'état d'une fonctionnalité silencieuse
  const updateFeatureStatusSilent = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    await updateFeatureSilent(moduleCode, featureCode, isEnabled, setModules);
    
    // Broadcast the change to other tabs
    broadcastFeatureStatusChange(moduleCode, featureCode, isEnabled);
  };
  
  // Mettre à jour l'état d'une fonctionnalité avec notification
  const updateFeatureStatus = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    await updateFeature(moduleCode, featureCode, isEnabled, setModules, setFeatures);
    
    // Broadcast the change to other tabs
    broadcastFeatureStatusChange(moduleCode, featureCode, isEnabled);
  };

  // S'abonner aux changements de modules via l'API temps réel de Supabase
  useEffect(() => {
    // Initialize tab synchronization
    initTabSync();
    
    // Charger les données initiales
    Promise.all([fetchModules(), fetchDependencies(), fetchFeatures()]);
    
    // Configurer les abonnements temps réel
    const { cleanup } = createModuleSubscriptions({
      onModuleChange: (payload) => {
        console.log('Module changed, refreshing data:', payload);
        fetchModules().then(newModules => {
          // Si un module a été mis à jour en 'inactive', vérifier les impacts sur les features
          if (payload?.eventType === 'UPDATE' && payload?.new?.status === 'inactive') {
            const moduleCode = newModules.find(m => m.id === payload.new.id)?.code;
            if (moduleCode) {
              // Rafraîchir les features également
              fetchFeatures();
            }
          }
        });
      },
      onFeatureChange: (payload) => {
        console.log('Feature changed, refreshing data:', payload);
        fetchFeatures().then(newFeatures => {
          // Mettre à jour les modules avec les nouvelles valeurs
          if (modules.length > 0) {
            const updatedModules = combineModulesWithFeatures(modules, newFeatures);
            setModules(updatedModules);
          }
        });
      },
      onDependencyChange: (payload) => {
        console.log('Dependency changed, refreshing data:', payload);
        fetchDependencies().then(() => {
          // Vérifier si des modules sont impactés par ce changement de dépendance
          fetchModules();
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
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    updateModuleStatus,
    updateFeatureStatus,
    updateFeatureStatusSilent,
    refreshModules: fetchModules,
    refreshDependencies: fetchDependencies,
  };
};
