
import { useState, useCallback, useEffect } from 'react';
import { AppModule, ModuleStatus } from '../types';
import { supabase } from '@/integrations/supabase/client';

// Importer les fonctions des nouveaux fichiers
import { 
  getModuleActiveStatus,
  getModuleDegradedStatus,
  getFeatureEnabledStatus
} from './moduleStatus';

import {
  isModuleActiveAsync,
  isModuleDegradedAsync,
  isFeatureEnabledAsync,
  refreshModulesData,
  refreshFeaturesData,
  updateModuleStatusData,
  updateFeatureStatusData
} from './moduleQueries';

import { initializeModuleApi } from './moduleInitialization';

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
    return isFeatureEnabledAsync(moduleCode, featureCode, isModuleActive);
  }, [isModuleActive]);

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
   * Rafraîchit tous les modules depuis Supabase
   */
  const refreshModules = useCallback(async (): Promise<AppModule[]> => {
    return refreshModulesData(setInternalModules, setLoading, setError, internalModules);
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
  const updateModuleStatus = useCallback(async (moduleId: string, status: ModuleStatus): Promise<boolean> => {
    return updateModuleStatusData(moduleId, status, internalModules, setInternalModules, refreshModules);
  }, [internalModules, refreshModules]);

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

    const { cleanupFunction } = initializeModuleApi(
      isInitialized,
      setIsInitialized,
      setInternalModules,
      setFeatures,
      setLoading,
      refreshModules,
      refreshFeatures
    );

    // Nettoyage
    return cleanupFunction;
  }, [isInitialized, refreshModules, refreshFeatures]);

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
    modules: internalModules
  };
};
