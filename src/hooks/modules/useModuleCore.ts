
/**
 * Core functionality for modules system
 * This file contains the main hook for modules management
 */

import { useModuleDataFetcher } from "./dataFetcher";
import { useStatusManager } from "./statusManager";
import { useModuleActive } from "./useModuleActive";
import { useModuleEffects } from "./useModuleEffects";

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

  // Obtenir les fonctions de vérification d'activité des modules
  const {
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled
  } = useModuleActive(modules, features);

  // Configurer les effets et abonnements
  useModuleEffects(modules, setModules, fetchModules, fetchDependencies, fetchFeatures);

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
