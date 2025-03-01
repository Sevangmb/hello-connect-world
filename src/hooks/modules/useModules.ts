
/**
 * Hook principal pour la gestion des modules dans l'application
 * Ce hook est un point d'entrée public qui agrège plusieurs hooks spécialisés
 */

import { useModuleCore } from "./useModuleCore";
import { useModuleStatusUpdate } from "./useModuleStatusUpdate";
import { useEffect, useState } from "react";
import { AppModule, ModuleStatus } from "./types";
import { 
  checkModuleActive, 
  checkModuleDegraded, 
  checkFeatureEnabled 
} from "./status/moduleStatusCheckers";
import {
  updateModuleStatus as updateModuleStatusFn,
  updateFeatureStatus as updateFeatureStatusFn,
  updateFeatureStatusSilent as updateFeatureStatusSilentFn
} from "./status/moduleStatusUpdater";
import { refreshModulesWithCache } from "./utils/moduleRefresh";
import { validateModuleStatus } from "./utils/statusValidation";
import { ADMIN_MODULE_CODE } from "./constants";

export const useModules = () => {
  // État pour suivre les initialisations
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Récupérer les fonctionnalités de base
  const {
    modules,
    dependencies,
    loading,
    error,
    features,
    isModuleActive: baseIsModuleActive,
    isModuleDegraded: baseIsModuleDegraded,
    isFeatureEnabled: baseIsFeatureEnabled,
    updateModule,
    updateFeature,
    updateFeatureSilent,
    fetchModules,
    fetchDependencies,
    setModules,
    connectionStatus
  } = useModuleCore();

  // Récupérer les fonctions de mise à jour de statut
  const {
    updateModuleStatus: updateModuleStatusCore,
    updateFeatureStatus: updateFeatureStatusCore,
    updateFeatureStatusSilent: updateFeatureStatusSilentCore
  } = useModuleStatusUpdate();

  // Forcer le chargement initial des modules
  useEffect(() => {
    if (!isInitialized && modules.length === 0) {
      console.log("useModules: Initialisation forcée des modules");
      fetchModules().then(loadedModules => {
        if (loadedModules.length === 0) {
          // Si toujours aucun module, essayer une requête Supabase directe
          refreshModulesWithCache(setModules)
            .then(() => {
              setIsInitialized(true);
            });
        } else {
          // Marquer tous les modules comme actifs
          const activatedModules = loadedModules.map(module => ({
            ...module,
            status: 'active' as ModuleStatus
          }));
          setModules(activatedModules);
          setIsInitialized(true);
        }
      });
    }
  }, [modules, fetchModules, setModules, isInitialized]);

  // Surcharger isModuleActive pour toujours retourner true
  const isModuleActive = (moduleCode: string): boolean => {
    // Toujours retourner true pour que tous les modules soient considérés comme actifs
    return checkModuleActive(moduleCode);
  };

  // Surcharger isModuleDegraded pour toujours retourner false
  const isModuleDegraded = (moduleCode: string): boolean => {
    // Toujours retourner false pour qu'aucun module ne soit considéré comme dégradé
    return checkModuleDegraded(moduleCode);
  };

  // Surcharger isFeatureEnabled pour toujours retourner true
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    // Toujours retourner true pour que toutes les fonctionnalités soient considérées comme activées
    return checkFeatureEnabled(moduleCode, featureCode);
  };

  // Wrapper pour mettre à jour le statut d'un module
  const updateModuleStatus = async (moduleId: string, status: ModuleStatus) => {
    const success = await updateModuleStatusFn(moduleId, status, modules);
    
    // Forcer un rafraîchissement des modules après la mise à jour
    if (success) {
      await fetchModules();
    }
    
    return success;
  };

  // Wrapper pour mettre à jour le statut d'une fonctionnalité
  const updateFeatureStatus = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    return updateFeatureStatusFn(moduleCode, featureCode, isEnabled);
  };

  // Wrapper pour mettre à jour le statut d'une fonctionnalité silencieusement
  const updateFeatureStatusSilent = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    return updateFeatureStatusSilentFn(moduleCode, featureCode, isEnabled);
  };

  // Fonction de rafraîchissement explicite qui force la mise à jour depuis Supabase
  const refreshModules = async () => {
    return refreshModulesWithCache(setModules);
  };

  return {
    // États et données
    modules,
    dependencies,
    loading,
    error,
    
    // Fonctions de vérification - toujours retourner que tout est actif
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    
    // Fonctions de mise à jour
    updateModuleStatus,
    updateFeatureStatus,
    updateFeatureStatusSilent,
    
    // Fonctions de rafraîchissement
    refreshModules,
    refreshDependencies: fetchDependencies,
    
    // Statut de connexion
    connectionStatus,
    
    // État d'initialisation
    isInitialized
  };
};
