
/**
 * Hook pour accéder au registre des modules dans les composants React
 * Version mise à jour pour utiliser le nouveau service de modules
 */
import { useEffect, useState, useCallback } from 'react';
import { AppModule, ModuleStatus } from './types';
import { moduleService } from '@/services/modules/ModuleService';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '@/services/modules/ModuleEvents';

export const useModuleRegistry = () => {
  const [modules, setModules] = useState<AppModule[]>(moduleService.getModules());
  const [dependencies, setDependencies] = useState<any[]>(moduleService.getDependencies());
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>(moduleService.getFeatures());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  // Initialiser le service au montage si pas déjà fait
  useEffect(() => {
    if (!initialized) {
      setLoading(true);
      moduleService.initialize().then(success => {
        setInitialized(success);
        setLoading(false);
        setModules(moduleService.getModules());
        setDependencies(moduleService.getDependencies());
        setFeatures(moduleService.getFeatures());
        setLastRefreshTime(Date.now());
      }).catch(err => {
        console.error("Erreur lors de l'initialisation du service de modules:", err);
        setError("Erreur lors de l'initialisation");
        setLoading(false);
      });
    }
  }, [initialized]);

  // S'abonner aux événements du service de modules
  useEffect(() => {
    // Mettre à jour l'état local quand les modules sont mis à jour
    const unsubscribeModules = eventBus.subscribe(MODULE_EVENTS.MODULES_REFRESHED, () => {
      setModules(moduleService.getModules());
      setLastRefreshTime(Date.now());
    });
    
    // Mettre à jour l'état local quand les fonctionnalités sont mises à jour
    const unsubscribeFeatures = eventBus.subscribe(MODULE_EVENTS.FEATURE_STATUS_CHANGED, () => {
      setFeatures(moduleService.getFeatures());
    });
    
    // Mettre à jour l'état local quand une erreur survient
    const unsubscribeError = eventBus.subscribe(MODULE_EVENTS.MODULE_ERROR, (event) => {
      setError(event.error);
    });
    
    // S'assurer que toutes les données sont à jour
    if (initialized) {
      setModules(moduleService.getModules());
      setDependencies(moduleService.getDependencies());
      setFeatures(moduleService.getFeatures());
    }
    
    // Nettoyer les abonnements au démontage
    return () => {
      unsubscribeModules();
      unsubscribeFeatures();
      unsubscribeError();
    };
  }, [initialized]);

  // Callback pour rafraîchir les modules
  const refreshModules = useCallback(async (force: boolean = false) => {
    setLoading(true);
    try {
      const updatedModules = await moduleService.refreshModules(force);
      setModules(updatedModules);
      setLastRefreshTime(Date.now());
      setLoading(false);
      return updatedModules;
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des modules:", err);
      setError("Erreur lors du rafraîchissement");
      setLoading(false);
      throw err;
    }
  }, []);

  // Callback pour rafraîchir les fonctionnalités
  const refreshFeatures = useCallback(async () => {
    setLoading(true);
    try {
      const updatedFeatures = await moduleService.refreshFeatures();
      setFeatures(updatedFeatures);
      setLoading(false);
      return updatedFeatures;
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des fonctionnalités:", err);
      setError("Erreur lors du rafraîchissement des fonctionnalités");
      setLoading(false);
      throw err;
    }
  }, []);

  // Callback pour mettre à jour le statut d'un module
  const updateModuleStatus = useCallback(async (moduleId: string, status: ModuleStatus) => {
    setLoading(true);
    try {
      const success = await moduleService.updateModuleStatus(moduleId, status);
      setLoading(false);
      if (success) {
        setModules(moduleService.getModules());
        setLastRefreshTime(Date.now());
      }
      return success;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut du module:", err);
      setError("Erreur lors de la mise à jour du statut");
      setLoading(false);
      return false;
    }
  }, []);

  // Callback pour mettre à jour le statut d'une fonctionnalité
  const updateFeatureStatus = useCallback(async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    setLoading(true);
    try {
      const success = await moduleService.updateFeatureStatus(moduleCode, featureCode, isEnabled);
      setLoading(false);
      if (success) {
        setFeatures(moduleService.getFeatures());
      }
      return success;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut de la fonctionnalité:", err);
      setError("Erreur lors de la mise à jour de la fonctionnalité");
      setLoading(false);
      return false;
    }
  }, []);

  // Fonction d'accès synchrone pour vérifier si un module est actif
  const isModuleActive = useCallback((moduleCode: string) => {
    return moduleService.isModuleActive(moduleCode);
  }, []);

  // Fonction d'accès synchrone pour vérifier si un module est en mode dégradé
  const isModuleDegraded = useCallback((moduleCode: string) => {
    return moduleService.isModuleDegraded(moduleCode);
  }, []);

  // Fonction d'accès synchrone pour vérifier si une fonctionnalité est activée
  const isFeatureEnabled = useCallback((moduleCode: string, featureCode: string) => {
    return moduleService.isFeatureEnabled(moduleCode, featureCode);
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
    refreshFeatures,
    updateModuleStatus,
    updateFeatureStatus,
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled
  };
};
