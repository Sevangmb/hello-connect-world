
// Update the useModuleApiCore hook to fix the errors
import { useState, useCallback, useEffect, useMemo } from 'react';
import { AppModule, ModuleStatus } from '../types';
import { supabase } from '@/integrations/supabase/client';

// Importer les fonctions des nouveaux fichiers refactorisés
import { 
  getModuleActiveStatus,
  getModuleDegradedStatus,
  getFeatureEnabledStatus,
  preloadModuleStatuses
} from './status';

import {
  isModuleActiveAsync,
  isModuleDegradedAsync,
  isFeatureEnabledAsync,
  refreshModulesData,
  refreshFeaturesData,
  updateModuleStatusData,
  updateFeatureStatusData
} from './queries';

import { moduleInitialization, initializeModuleApi } from './moduleInitialization';

// Cache pour éviter des chargements répétés
const CACHE_EXPIRY = 60000; // 60 secondes 
let lastModulesUpdate = 0;
let cachedModules: AppModule[] = [];

/**
 * Core hook pour la gestion des états et opérations des modules
 */
export const useModuleApiCore = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalModules, setInternalModules] = useState<AppModule[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});

  /**
   * Vérifie si un module est actif de manière asynchrone
   */
  const isModuleActive = useCallback(async (moduleCode: string): Promise<boolean> => {
    return isModuleActiveAsync(moduleCode);
  }, []);

  /**
   * Vérifie si un module est en mode dégradé de manière asynchrone
   */
  const isModuleDegraded = useCallback(async (moduleCode: string): Promise<boolean> => {
    return isModuleDegradedAsync(moduleCode);
  }, []);

  /**
   * Vérifie si une fonctionnalité est activée de manière asynchrone
   */
  const isFeatureEnabled = useCallback(async (moduleCode: string, featureCode: string): Promise<boolean> => {
    // Fix argument count by removing the third argument
    return isFeatureEnabledAsync(moduleCode, featureCode);
  }, []);

  /**
   * Fonction synchrone pour vérifier rapidement le statut d'un module
   */
  const getModuleActiveStatusCallback = useCallback((moduleCode: string): boolean => {
    return getModuleActiveStatus(moduleCode, internalModules);
  }, [internalModules]);

  /**
   * Fonction synchrone pour vérifier si un module est dégradé
   */
  const getModuleDegradedStatusCallback = useCallback((moduleCode: string): boolean => {
    return getModuleDegradedStatus(moduleCode, internalModules);
  }, [internalModules]);

  /**
   * Fonction synchrone pour vérifier si une fonctionnalité est activée
   */
  const getFeatureEnabledStatusCallback = useCallback((moduleCode: string, featureCode: string): boolean => {
    return getFeatureEnabledStatus(moduleCode, featureCode, features, getModuleActiveStatusCallback);
  }, [getModuleActiveStatusCallback, features]);

  /**
   * Rafraîchit tous les modules depuis Supabase avec cache intelligent
   */
  const refreshModules = useCallback(async (force = false): Promise<AppModule[]> => {
    // Vérifier si nous avons des modules en cache récents
    const now = Date.now();
    if (!force && cachedModules.length > 0 && (now - lastModulesUpdate < CACHE_EXPIRY)) {
      // Utiliser la version en cache
      setInternalModules(cachedModules);
      setLoading(false);
      return cachedModules;
    }
    
    const result = await refreshModulesData(setInternalModules, setLoading, setError, internalModules);
    
    // Mettre à jour le cache 
    if (result.length > 0) {
      cachedModules = result;
      lastModulesUpdate = now;
    }
    
    return result;
  }, [internalModules]);

  /**
   * Rafraîchit toutes les fonctionnalités depuis Supabase
   */
  const refreshFeatures = useCallback(async (force = false): Promise<Record<string, Record<string, boolean>>> => {
    return refreshFeaturesData(setFeatures, setLoading, setError, features);
  }, [features]);

  /**
   * Met à jour le statut d'un module
   */
  const updateModuleStatus = async (moduleId: string, status: ModuleStatus): Promise<boolean> => {
    const result = await updateModuleStatusData(moduleId, status, internalModules, setInternalModules, refreshModules);
    
    // Si la mise à jour a réussi, invalider le cache
    if (result) {
      lastModulesUpdate = 0;
      // Précharger les statuts après la mise à jour
      setTimeout(() => {
        preloadModuleStatuses();
      }, 500);
    }
    
    return result;
  };

  /**
   * Met à jour le statut d'une fonctionnalité
   */
  const updateFeatureStatus = useCallback(async (
    moduleCode: string, 
    featureCode: string, 
    isEnabled: boolean
  ): Promise<boolean> => {
    return updateFeatureStatusData(moduleCode, featureCode, isEnabled, features, setFeatures, refreshFeatures);
  }, [features, refreshFeatures]);

  // Initialiser le cache et configurer les abonnements temps réel
  useEffect(() => {
    if (isInitialized) return;

    const init = async () => {
      const { cleanupFunction } = await initializeModuleApi(
        isInitialized,
        setIsInitialized,
        setInternalModules,
        setFeatures,
        setLoading,
        refreshModules,
        refreshFeatures
      );
      
      // Précharger les statuts
      preloadModuleStatuses();
      
      // Return cleanup function
      return cleanupFunction;
    };
    
    const cleanup = init();
    
    // Nettoyage
    return () => {
      cleanup.then(fn => {
        if (typeof fn === 'function') fn();
      });
    };
  }, [isInitialized, refreshModules, refreshFeatures]);

  // Memoize les modules pour de meilleures performances
  const memoizedModules = useMemo(() => internalModules, [internalModules]);

  return {
    // Fonctions asynchrones
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    
    // Fonctions synchrones
    getModuleActiveStatus: getModuleActiveStatusCallback,
    getModuleDegradedStatus: getModuleDegradedStatusCallback,
    getFeatureEnabledStatus: getFeatureEnabledStatusCallback,
    
    // Fonctions de rafraîchissement
    refreshModules,
    refreshFeatures,
    
    // Fonctions de mise à jour
    updateModuleStatus,
    updateFeatureStatus,
    
    // État
    loading,
    error,
    isInitialized,
    modules: memoizedModules
  };
};
