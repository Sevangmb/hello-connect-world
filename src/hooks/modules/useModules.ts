
/**
 * Hook principal pour la gestion des modules dans l'application
 * Ce hook est un point d'entrée public qui agrège plusieurs hooks spécialisés
 */

import { useModuleCore } from "./useModuleCore";
import { useModuleStatusUpdate } from "./useModuleStatusUpdate";

export const useModules = () => {
  // Récupérer les fonctionnalités de base
  const {
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
  } = useModuleCore();

  // Récupérer les fonctions de mise à jour de statut
  const {
    updateModuleStatus: updateModuleStatusFn,
    updateFeatureStatus: updateFeatureStatusFn,
    updateFeatureStatusSilent: updateFeatureStatusSilentFn
  } = useModuleStatusUpdate();

  // Wrapper pour mettre à jour le statut d'un module
  const updateModuleStatus = async (moduleId: string, status: ModuleStatus) => {
    return updateModuleStatusFn(moduleId, status, modules, updateModule, setModules);
  };

  // Wrapper pour mettre à jour le statut d'une fonctionnalité
  const updateFeatureStatus = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    return updateFeatureStatusFn(moduleCode, featureCode, isEnabled, updateFeature, setModules, features);
  };

  // Wrapper pour mettre à jour le statut d'une fonctionnalité silencieusement
  const updateFeatureStatusSilent = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    return updateFeatureStatusSilentFn(moduleCode, featureCode, isEnabled, updateFeatureSilent);
  };

  return {
    // États et données
    modules,
    dependencies,
    loading,
    error,
    
    // Fonctions de vérification
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    
    // Fonctions de mise à jour
    updateModuleStatus,
    updateFeatureStatus,
    updateFeatureStatusSilent,
    
    // Fonctions de rafraîchissement
    refreshModules: fetchModules,
    refreshDependencies: fetchDependencies,
  };
};
