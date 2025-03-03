
/**
 * Hook pour accéder au registre des modules dans les composants React
 */
import { useEffect, useState, useCallback } from 'react';
import { AppModule, ModuleStatus } from './types';
import { moduleRegistry, MODULE_EVENTS } from './services/ModuleRegistry';

export const useModuleRegistry = () => {
  const [modules, setModules] = useState<AppModule[]>(moduleRegistry.getModules());
  const [dependencies, setDependencies] = useState<any[]>(moduleRegistry.getDependencies());
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>(moduleRegistry.getFeatures());
  const [loading, setLoading] = useState<boolean>(moduleRegistry.isLoading());
  const [error, setError] = useState<string | null>(moduleRegistry.getError());
  const [initialized, setInitialized] = useState<boolean>(moduleRegistry.getInitialized());
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(moduleRegistry.getLastRefreshTime());

  // Initialiser le registre au montage si pas déjà fait
  useEffect(() => {
    if (!initialized) {
      moduleRegistry.initialize().then(success => {
        setInitialized(success);
      });
    }
  }, [initialized]);

  // S'abonner aux événements de mise à jour des modules
  useEffect(() => {
    // Mettre à jour l'état local quand les modules sont mis à jour
    const modulesUpdateUnsubscribe = moduleRegistry.addListener(
      MODULE_EVENTS.MODULES_UPDATED,
      () => {
        setModules(moduleRegistry.getModules());
        setLastRefreshTime(moduleRegistry.getLastRefreshTime());
      }
    );
    
    // Mettre à jour l'état local quand les fonctionnalités sont mises à jour
    const featuresUpdateUnsubscribe = moduleRegistry.addListener(
      MODULE_EVENTS.FEATURES_UPDATED,
      () => {
        setFeatures(moduleRegistry.getFeatures());
      }
    );
    
    // Mettre à jour l'état local quand l'état de chargement change
    const loadingUpdateUnsubscribe = moduleRegistry.addListener(
      MODULE_EVENTS.LOADING_STATE_CHANGED,
      () => {
        setLoading(moduleRegistry.isLoading());
      }
    );
    
    // Mettre à jour l'état local quand une erreur survient
    const errorUpdateUnsubscribe = moduleRegistry.addListener(
      MODULE_EVENTS.ERROR_OCCURRED,
      () => {
        setError(moduleRegistry.getError());
      }
    );
    
    // S'assurer que toutes les données sont à jour
    setModules(moduleRegistry.getModules());
    setDependencies(moduleRegistry.getDependencies());
    setFeatures(moduleRegistry.getFeatures());
    setLoading(moduleRegistry.isLoading());
    setError(moduleRegistry.getError());
    setLastRefreshTime(moduleRegistry.getLastRefreshTime());
    
    // Nettoyer les abonnements au démontage
    return () => {
      modulesUpdateUnsubscribe();
      featuresUpdateUnsubscribe();
      loadingUpdateUnsubscribe();
      errorUpdateUnsubscribe();
    };
  }, []);

  // Callback pour rafraîchir les modules
  const refreshModules = useCallback(async (force: boolean = false) => {
    return moduleRegistry.refreshModules(force);
  }, []);

  // Callback pour rafraîchir les dépendances
  const refreshDependencies = useCallback(async () => {
    return moduleRegistry.refreshDependencies();
  }, []);

  // Callback pour rafraîchir les fonctionnalités
  const refreshFeatures = useCallback(async () => {
    return moduleRegistry.refreshFeatures();
  }, []);

  // Callback pour mettre à jour le statut d'un module
  const updateModuleStatus = useCallback(async (moduleId: string, status: ModuleStatus) => {
    return moduleRegistry.updateModuleStatus(moduleId, status);
  }, []);

  // Callback pour mettre à jour le statut d'une fonctionnalité
  const updateFeatureStatus = useCallback(async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    return moduleRegistry.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  }, []);

  // Callback pour vérifier si un module est actif
  const isModuleActive = useCallback((moduleCode: string) => {
    return moduleRegistry.isModuleActive(moduleCode);
  }, []);

  // Callback pour vérifier si un module est en mode dégradé
  const isModuleDegraded = useCallback((moduleCode: string) => {
    return moduleRegistry.isModuleDegraded(moduleCode);
  }, []);

  // Callback pour vérifier si une fonctionnalité est activée
  const isFeatureEnabled = useCallback((moduleCode: string, featureCode: string) => {
    return moduleRegistry.isFeatureEnabled(moduleCode, featureCode);
  }, []);

  return {
    modules,
    dependencies,
    features,
    loading,
    error,
    initialized,
    lastRefreshTime,
    refreshModules,
    refreshDependencies,
    refreshFeatures,
    updateModuleStatus,
    updateFeatureStatus,
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled
  };
};
