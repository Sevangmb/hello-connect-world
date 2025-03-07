
/**
 * Hook principal pour la gestion des modules dans l'application
 * Ce hook est un point d'entrée public qui agrège plusieurs hooks spécialisés
 */

import { useCallback, useState, useEffect } from "react";
import { AppModule, ModuleStatus } from "./types";
import { supabase } from '@/integrations/supabase/client';
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
import { ADMIN_MODULE_CODE } from "./constants";

export const useModules = () => {
  // État pour suivre les initialisations
  const [isInitialized, setIsInitialized] = useState(false);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  // Récupérer tous les modules
  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setConnectionStatus('connected');
      setModules(data);
      return data;
    } catch (err: any) {
      console.error('Erreur lors du chargement des modules:', err);
      setError(err);
      setConnectionStatus('disconnected');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer toutes les fonctionnalités
  const fetchFeatures = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*');
      
      if (error) throw error;
      
      // Organiser les fonctionnalités par module
      const featuresData: Record<string, Record<string, boolean>> = {};
      data.forEach((feature: any) => {
        if (!featuresData[feature.module_code]) {
          featuresData[feature.module_code] = {};
        }
        featuresData[feature.module_code][feature.feature_code] = feature.is_enabled;
      });
      
      setFeatures(featuresData);
      return featuresData;
    } catch (err: any) {
      console.error('Erreur lors du chargement des fonctionnalités:', err);
      setError(err);
      return {};
    }
  }, []);

  // Récupérer les dépendances
  const fetchDependencies = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('module_dependencies')
        .select('*');
      
      if (error) throw error;
      
      setDependencies(data);
      return data;
    } catch (err: any) {
      console.error('Erreur lors du chargement des dépendances:', err);
      setError(err);
      return [];
    }
  }, []);

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
          setModules(loadedModules);
          setIsInitialized(true);
        }
      });
    }
  }, [modules, fetchModules, isInitialized]);

  // Mise à jour d'un module
  const updateModule = useCallback(async (moduleId: string, status: ModuleStatus) => {
    try {
      const { error } = await supabase
        .from('app_modules')
        .update({ status })
        .eq('id', moduleId);
      
      if (error) throw error;
      
      // Rafraîchir les modules
      fetchModules();
      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du module:', err);
      return false;
    }
  }, [fetchModules]);

  // Mise à jour d'une fonctionnalité
  const updateFeature = useCallback(async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ is_enabled: isEnabled })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);
      
      if (error) throw error;
      
      // Rafraîchir les fonctionnalités
      fetchFeatures();
      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la fonctionnalité:', err);
      return false;
    }
  }, [fetchFeatures]);
  
  // Mise à jour silencieuse
  const updateFeatureSilent = useCallback(async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    try {
      return await updateFeature(moduleCode, featureCode, isEnabled);
    } catch (err) {
      return false;
    }
  }, [updateFeature]);

  // Vérifier si un module est actif
  const isModuleActive = useCallback((moduleCode: string): boolean => {
    // Vérifier dans la liste des modules
    const module = modules.find(m => m.code === moduleCode);
    if (module) {
      return module.status === 'active';
    }
    return false;
  }, [modules]);

  // Vérifier si un module est dégradé
  const isModuleDegraded = useCallback((moduleCode: string): boolean => {
    const module = modules.find(m => m.code === moduleCode);
    if (module) {
      return module.status === 'degraded';
    }
    return false;
  }, [modules]);

  // Vérifier si une fonctionnalité est activée
  const isFeatureEnabled = useCallback((moduleCode: string, featureCode: string): boolean => {
    if (features[moduleCode]) {
      return features[moduleCode][featureCode] === true;
    }
    return false;
  }, [features]);

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
    features,
    
    // Fonctions de vérification
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    
    // Fonctions de mise à jour
    updateModule,
    updateFeature,
    updateFeatureSilent,
    updateModuleStatus,
    updateFeatureStatus,
    updateFeatureStatusSilent,
    
    // Fonctions de chargement
    fetchModules,
    fetchDependencies,
    setModules,
    
    // Fonction de rafraîchissement
    refreshModules,
    
    // Statut de connexion
    connectionStatus,
    
    // État d'initialisation
    isInitialized
  };
};
