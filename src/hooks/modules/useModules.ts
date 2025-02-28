
import { useEffect } from "react";
import { checkModuleActive, checkModuleDegraded, checkFeatureEnabled } from "./utils";
import { ModuleStatus } from "./types";
import { useModuleDataFetcher } from "./dataFetcher";
import { useStatusManager } from "./statusManager";
import { createModuleSubscriptions } from "./subscriptions";

export const useModules = () => {
  // Récupérer les données des modules et dépendances
  const {
    modules,
    setModules,
    dependencies,
    features,
    setFeatures,
    loading,
    error,
    fetchModules,
    fetchDependencies
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
  };

  // Mettre à jour l'état d'une fonctionnalité silencieuse
  const updateFeatureStatusSilent = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    await updateFeatureSilent(moduleCode, featureCode, isEnabled, setModules);
  };
  
  // Mettre à jour l'état d'une fonctionnalité avec notification
  const updateFeatureStatus = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    await updateFeature(moduleCode, featureCode, isEnabled, setModules, setFeatures);
  };

  // S'abonner aux changements de modules via l'API temps réel de Supabase
  useEffect(() => {
    const { cleanup } = createModuleSubscriptions({
      onModuleChange: () => {
        // Rafraîchir les modules quand il y a un changement
        fetchModules();
      },
      onFeatureChange: () => {
        // Rafraîchir les features quand il y a un changement
        const updateFeatures = async () => {
          try {
            const updatedFeatures = await fetchFeatures();
            if (updatedFeatures) {
              setFeatures(updatedFeatures);
              
              // Mettre à jour les modules avec les nouvelles valeurs
              setModules(prevModules => 
                combineModulesWithFeatures(prevModules, updatedFeatures)
              );
            }
          } catch (error) {
            console.error("Erreur lors de la mise à jour des fonctionnalités:", error);
          }
        };
        
        updateFeatures();
      }
    });

    // Nettoyer les abonnements à la destruction du composant
    return cleanup;
  }, []);

  // Charger les données au montage du composant
  useEffect(() => {
    Promise.all([fetchModules(), fetchDependencies()]);
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

// Ajouter l'import manquant pour fetchFeatures et combineModulesWithFeatures
import { fetchFeatureFlags as fetchFeatures } from "./api";
import { combineModulesWithFeatures } from "./utils";
