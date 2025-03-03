
/**
 * Hook pour accéder au registre des modules dans les composants React
 * Version mise à jour pour utiliser l'API Gateway
 */
import { useEffect, useState, useCallback } from 'react';
import { AppModule, ModuleStatus } from './types';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '@/services/modules/ModuleEvents';
import { useEventSubscription } from '@/hooks/useEventBus';

export const useModuleRegistry = () => {
  const [modules, setModules] = useState<AppModule[]>(moduleApiGateway.getModules());
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  // S'abonner aux événements du service de modules
  useEventSubscription(MODULE_EVENTS.MODULES_REFRESHED, (data) => {
    setModules(moduleApiGateway.getModules());
    setLastRefreshTime(Date.now());
  });
  
  useEventSubscription(MODULE_EVENTS.FEATURE_STATUS_CHANGED, () => {
    setFeatures((prevFeatures) => ({ ...prevFeatures }));
  });
  
  useEventSubscription(MODULE_EVENTS.MODULE_ERROR, (event) => {
    setError(event.error);
  });
  
  // Initialiser le service au montage
  useEffect(() => {
    if (!initialized) {
      setLoading(true);
      moduleApiGateway.initialize().then(success => {
        setInitialized(success);
        setLoading(false);
        setModules(moduleApiGateway.getModules());
        setLastRefreshTime(Date.now());
      }).catch(err => {
        console.error("Erreur lors de l'initialisation du service de modules:", err);
        setError("Erreur lors de l'initialisation");
        setLoading(false);
      });
    }
  }, [initialized]);

  // Callback pour rafraîchir les modules
  const refreshModules = useCallback(async (force: boolean = false) => {
    setLoading(true);
    try {
      const updatedModules = await moduleApiGateway.refreshModules(force);
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

  // Callback pour mettre à jour le statut d'un module
  const updateModuleStatus = useCallback(async (moduleId: string, status: ModuleStatus) => {
    setLoading(true);
    try {
      const success = await moduleApiGateway.updateModuleStatus(moduleId, status);
      setLoading(false);
      if (success) {
        setModules(moduleApiGateway.getModules());
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
      const success = await moduleApiGateway.updateFeatureStatus(moduleCode, featureCode, isEnabled);
      setLoading(false);
      if (success) {
        // Mettre à jour l'état local des fonctionnalités
        setFeatures(prevFeatures => {
          const newFeatures = { ...prevFeatures };
          if (!newFeatures[moduleCode]) {
            newFeatures[moduleCode] = {};
          }
          newFeatures[moduleCode][featureCode] = isEnabled;
          return newFeatures;
        });
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
    return moduleApiGateway.isModuleActive(moduleCode);
  }, []);

  // Fonction d'accès synchrone pour vérifier si un module est en mode dégradé
  const isModuleDegraded = useCallback((moduleCode: string) => {
    return moduleApiGateway.isModuleDegraded(moduleCode);
  }, []);

  // Fonction d'accès synchrone pour vérifier si une fonctionnalité est activée
  const isFeatureEnabled = useCallback((moduleCode: string, featureCode: string) => {
    return moduleApiGateway.isFeatureEnabled(moduleCode, featureCode);
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
    updateModuleStatus,
    updateFeatureStatus,
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled
  };
};
