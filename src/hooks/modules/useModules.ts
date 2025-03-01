
/**
 * Hook principal pour la gestion des modules dans l'application
 * Ce hook est un point d'entrée public qui agrège plusieurs hooks spécialisés
 */

import { useModuleCore } from "./useModuleCore";
import { useModuleStatusUpdate } from "./useModuleStatusUpdate";
import { ModuleStatus } from "./types";
import { useEffect } from "react";

// Constante pour identifier le module Admin
export const ADMIN_MODULE_CODE = "admin";

export const useModules = () => {
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
    updateModuleStatus: updateModuleStatusFn,
    updateFeatureStatus: updateFeatureStatusFn,
    updateFeatureStatusSilent: updateFeatureStatusSilentFn
  } = useModuleStatusUpdate();

  // Vérifier et corriger automatiquement le statut du module Admin s'il a été désactivé
  useEffect(() => {
    const checkAdminModuleStatus = async () => {
      if (modules.length > 0) {
        const adminModule = modules.find(m => m.code === ADMIN_MODULE_CODE);
        if (adminModule && adminModule.status !== 'active') {
          console.warn("Module Admin trouvé désactivé - Correction automatique");
          await updateModuleStatus(adminModule.id, 'active');
        }
      }
    };
    
    checkAdminModuleStatus();
  }, [modules]);

  // Surcharger isModuleActive pour toujours retourner true pour le module Admin
  const isModuleActive = (moduleCode: string): boolean => {
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) {
      return true;
    }
    
    // Log pour débuggage
    console.log(`useModules.isModuleActive: Vérification du module ${moduleCode}`);
    
    // Utiliser la fonction de base
    const isActive = baseIsModuleActive(moduleCode);
    console.log(`useModules.isModuleActive: Résultat pour ${moduleCode}: ${isActive}`);
    
    return isActive;
  };

  // Surcharger isModuleDegraded pour toujours retourner false pour le module Admin
  const isModuleDegraded = (moduleCode: string): boolean => {
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) {
      return false;
    }
    return baseIsModuleDegraded(moduleCode);
  };

  // Surcharger isFeatureEnabled pour toujours retourner true pour les fonctionnalités du module Admin
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) {
      return true;
    }
    return baseIsFeatureEnabled(moduleCode, featureCode);
  };

  // Wrapper pour mettre à jour le statut d'un module
  const updateModuleStatus = async (moduleId: string, status: ModuleStatus) => {
    const moduleToUpdate = modules.find(m => m.id === moduleId);
    
    // Empêcher la désactivation du module Admin
    if (moduleToUpdate && (moduleToUpdate.code === ADMIN_MODULE_CODE || moduleToUpdate.code.startsWith('admin')) && status !== 'active') {
      console.error("Le module Admin ne peut pas être désactivé");
      return false;
    }
    
    const success = await updateModuleStatusFn(moduleId, status, modules, updateModule, setModules);
    
    // Forcer un rafraîchissement des modules après la mise à jour
    if (success) {
      await fetchModules();
    }
    
    return success;
  };

  // Wrapper pour mettre à jour le statut d'une fonctionnalité
  const updateFeatureStatus = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    // Empêcher la désactivation des fonctionnalités du module Admin
    if ((moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) && !isEnabled) {
      console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
      return false;
    }
    
    return updateFeatureStatusFn(moduleCode, featureCode, isEnabled, updateFeature, setModules, features);
  };

  // Wrapper pour mettre à jour le statut d'une fonctionnalité silencieusement
  const updateFeatureStatusSilent = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    // Empêcher la désactivation des fonctionnalités du module Admin
    if ((moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) && !isEnabled) {
      console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
      return false;
    }
    
    return updateFeatureStatusSilentFn(moduleCode, featureCode, isEnabled, updateFeatureSilent);
  };

  // Fonction de rafraîchissement explicite qui force la mise à jour depuis Supabase
  const refreshModules = async () => {
    console.log("useModules: Forçage du rafraîchissement des modules");
    const updatedModules = await fetchModules();
    console.log(`useModules: ${updatedModules.length} modules récupérés`);
    return updatedModules;
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
    refreshModules,
    refreshDependencies: fetchDependencies,
    
    // Statut de connexion
    connectionStatus
  };
};
