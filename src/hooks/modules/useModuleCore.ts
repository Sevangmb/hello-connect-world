
/**
 * Core functionality for modules system
 * This file contains the main hook for modules management
 */

import { useEffect, useState } from "react";
import { useModuleDataFetcher } from "./dataFetcher";
import { useStatusManager } from "./statusManager";
import { useModuleActive } from "./useModuleActive";
import { useModuleEffects } from "./useModuleEffects";
import { useModuleApiContext } from "./ModuleApiContext";
import { AppModule } from "./types";

/**
 * Hook principal pour la gestion des modules
 * Fournit toutes les fonctions nécessaires pour interagir avec les modules
 */
export const useModuleCore = () => {
  // Récupérer l'API des modules depuis le contexte
  const moduleApi = useModuleApiContext();
  // État local pour les modules
  const [localModules, setLocalModules] = useState<AppModule[]>([]);
  
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

  // Utiliser les modules du cache si disponibles, sinon charger depuis Supabase
  useEffect(() => {
    if (!moduleApi.loading && moduleApi.isInitialized) {
      moduleApi.refreshModules().then(modulesData => {
        if (modulesData && modulesData.length > 0) {
          setLocalModules(modulesData);
          setModules(modulesData);
        }
      });
    }
  }, [moduleApi, setModules]);

  return {
    modules: localModules.length > 0 ? localModules : modules,
    dependencies,
    loading: loading || moduleApi.loading,
    error: error || moduleApi.error,
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
