
import { useState, useCallback, useEffect } from 'react';
import { AppModule, ModuleStatus } from '../types';
import { getModuleStatusesFromCache } from '../utils';
import { loadModulesFromCache, loadFeaturesFromCache, cacheFeaturesData } from '../api/moduleCache';
import { 
  fetchAllModules, 
  fetchAllFeatures, 
  setupModuleRealtimeChannel 
} from '../api/moduleSync';
import { 
  checkModuleActiveAsync, 
  checkModuleDegradedAsync, 
  checkFeatureEnabledAsync, 
  updateModuleStatusInDb, 
  updateFeatureStatusInDb,
  updateModuleCache,
  getModuleCache
} from '../api/moduleStatus';
import { supabase } from '@/integrations/supabase/client';
import { broadcastModuleStatusChange } from '../tabSync';
import { triggerModuleStatusChanged } from '../events';
import { ADMIN_MODULE_CODE } from '../useModules';

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
    return checkModuleActiveAsync(moduleCode);
  }, []);

  /**
   * Vérifie si un module est en mode dégradé de manière asynchrone
   */
  const isModuleDegraded = useCallback(async (moduleCode: string): Promise<boolean> => {
    return checkModuleDegradedAsync(moduleCode);
  }, []);

  /**
   * Vérifie si une fonctionnalité est activée de manière asynchrone
   */
  const isFeatureEnabled = useCallback(async (moduleCode: string, featureCode: string): Promise<boolean> => {
    return checkFeatureEnabledAsync(moduleCode, featureCode, isModuleActive);
  }, [isModuleActive]);

  /**
   * Fonction synchrone pour vérifier rapidement le statut d'un module
   */
  const getModuleActiveStatus = useCallback((moduleCode: string): boolean => {
    // Si c'est le module Admin, toujours actif
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return true;

    // DEBUG: Log module check
    console.log(`Checking active status for module: ${moduleCode}`);

    // Vérifier le cache en mémoire
    const { inMemoryModulesCache } = getModuleCache();
    if (inMemoryModulesCache && inMemoryModulesCache.length > 0) {
      const module = inMemoryModulesCache.find(m => m.code === moduleCode);
      if (module) {
        console.log(`Found module ${moduleCode} in memory cache with status: ${module.status}`);
        return module.status === 'active';
      }
    }
    
    // Utiliser les modules internes si disponibles
    if (internalModules.length > 0) {
      const module = internalModules.find(m => m.code === moduleCode);
      if (module) {
        console.log(`Found module ${moduleCode} in internal modules with status: ${module.status}`);
        return module.status === 'active';
      }
    }

    // Vérifier le cache localStorage
    const cachedStatuses = getModuleStatusesFromCache();
    if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
      console.log(`Found module ${moduleCode} in localStorage cache with status: ${cachedStatuses[moduleCode]}`);
      return cachedStatuses[moduleCode] === 'active';
    }

    // Log if module not found
    console.log(`Module ${moduleCode} not found in any cache, defaulting to false`);
    
    // Par défaut inactif
    return false;
  }, [internalModules]);

  /**
   * Fonction synchrone pour vérifier si un module est dégradé
   */
  const getModuleDegradedStatus = useCallback((moduleCode: string): boolean => {
    // Si c'est le module Admin, jamais dégradé
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return false;

    // Vérifier le cache en mémoire
    const { inMemoryModulesCache } = getModuleCache();
    if (inMemoryModulesCache) {
      const module = inMemoryModulesCache.find(m => m.code === moduleCode);
      if (module) {
        return module.status === 'degraded';
      }
    }
    
    // Utiliser les modules internes si disponibles
    if (internalModules.length > 0) {
      const module = internalModules.find(m => m.code === moduleCode);
      if (module) {
        return module.status === 'degraded';
      }
    }

    // Vérifier le cache localStorage
    const cachedStatuses = getModuleStatusesFromCache();
    if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
      return cachedStatuses[moduleCode] === 'degraded';
    }

    // Par défaut non dégradé
    return false;
  }, [internalModules]);

  /**
   * Fonction synchrone pour vérifier si une fonctionnalité est activée
   */
  const getFeatureEnabledStatus = useCallback((moduleCode: string, featureCode: string): boolean => {
    // Si c'est le module Admin, toutes les fonctionnalités sont actives
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return true;

    // Vérifier d'abord si le module est actif
    const moduleActive = getModuleActiveStatus(moduleCode);
    if (!moduleActive) return false;

    // Vérifier dans les fonctionnalités locales
    if (features[moduleCode]) {
      const featureEnabled = features[moduleCode][featureCode];
      if (featureEnabled !== undefined) {
        return featureEnabled;
      }
    }

    // Par défaut désactivé
    return false;
  }, [getModuleActiveStatus, features]);

  /**
   * Rafraîchit tous les modules depuis Supabase
   */
  const refreshModules = useCallback(async (force = false): Promise<AppModule[]> => {
    const { inMemoryModulesCache, lastFetchTimestamp } = getModuleCache();
    const now = Date.now();

    // Utiliser le cache si récent et pas de forçage
    if (inMemoryModulesCache && inMemoryModulesCache.length > 0 && !force && (now - lastFetchTimestamp < 30000)) {
      console.log(`Using in-memory cache with ${inMemoryModulesCache.length} modules (cache age: ${now - lastFetchTimestamp}ms)`);
      setInternalModules(inMemoryModulesCache);
      return inMemoryModulesCache;
    }

    setLoading(true);
    try {
      console.log("Fetching modules from Supabase...");
      const modulesData = await fetchAllModules(force);
      console.log(`Fetched ${modulesData.length} modules from Supabase`);
      
      // Vérifier que les modules contiennent bien des valeurs ModuleStatus valides
      const validatedModules = modulesData.map(module => {
        if (module.status !== 'active' && module.status !== 'inactive' && module.status !== 'degraded') {
          console.warn(`Invalid module status "${module.status}" for module ${module.code}, defaulting to "inactive"`);
          return { ...module, status: 'inactive' as ModuleStatus };
        }
        return module;
      });
      
      // Mettre à jour les états
      setInternalModules(validatedModules);
      updateModuleCache(validatedModules);
      setLoading(false);
      
      return validatedModules;
    } catch (e: any) {
      console.error('Erreur lors du chargement des modules:', e);
      setError(e.message || 'Erreur lors du chargement des modules');
      setLoading(false);
      
      // Retourner le cache en cas d'erreur
      return inMemoryModulesCache || internalModules || [];
    }
  }, [internalModules]);

  /**
   * Rafraîchit toutes les fonctionnalités depuis Supabase
   */
  const refreshFeatures = useCallback(async (force = false): Promise<Record<string, Record<string, boolean>>> => {
    setLoading(true);
    try {
      const featuresData = await fetchAllFeatures();
      setFeatures(featuresData);
      setLoading(false);
      return featuresData;
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement des fonctionnalités');
      setLoading(false);
      return features;
    }
  }, [features]);

  /**
   * Met à jour le statut d'un module
   */
  const updateModuleStatus = useCallback(async (moduleId: string, status: ModuleStatus): Promise<boolean> => {
    // Vérifier si c'est le module Admin
    const isAdminModule = internalModules.some(
      m => m.id === moduleId && (m.code === ADMIN_MODULE_CODE || m.code.startsWith('admin'))
    );
    
    const success = await updateModuleStatusInDb(moduleId, status, isAdminModule);
    
    if (success) {
      // Mettre à jour le cache en mémoire
      setInternalModules(prev => 
        prev.map(module => module.id === moduleId ? { ...module, status } : module)
      );
      
      // Mettre à jour également le cache mémoire global
      const { inMemoryModulesCache } = getModuleCache();
      if (inMemoryModulesCache) {
        const updatedCache = inMemoryModulesCache.map(module => 
          module.id === moduleId ? { ...module, status } : module
        );
        updateModuleCache(updatedCache);
      }
      
      // Diffuser le changement
      broadcastModuleStatusChange(moduleId, status);
      triggerModuleStatusChanged();
      
      // Rafraîchir les données
      await refreshModules(true);
    }
    
    return success;
  }, [internalModules, refreshModules]);

  /**
   * Met à jour le statut d'une fonctionnalité
   */
  const updateFeatureStatus = useCallback(async (
    moduleCode: string, 
    featureCode: string, 
    isEnabled: boolean
  ): Promise<boolean> => {
    const isAdminModule = moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin');
    
    const success = await updateFeatureStatusInDb(moduleCode, featureCode, isEnabled, isAdminModule);
    
    if (success) {
      // Mettre à jour le cache local
      setFeatures(prev => {
        const updated = { ...prev };
        if (!updated[moduleCode]) {
          updated[moduleCode] = {};
        }
        updated[moduleCode][featureCode] = isEnabled;
        return updated;
      });
      
      // Mettre à jour le cache localStorage
      cacheFeaturesData({
        ...features,
        [moduleCode]: {
          ...(features[moduleCode] || {}),
          [featureCode]: isEnabled
        }
      });
      
      // Rafraîchir les données
      await refreshFeatures(true);
    }
    
    return success;
  }, [features, refreshFeatures]);

  // Initialiser le cache et configurer les abonnements temps réel
  useEffect(() => {
    if (isInitialized) return;

    const initializeModule = async () => {
      console.log("Initialisation du module API...");
      
      // Essayer d'abord de charger depuis le cache
      const cachedModules = loadModulesFromCache();
      if (cachedModules && cachedModules.length > 0) {
        console.log(`Loaded ${cachedModules.length} modules from cache`);
        setInternalModules(cachedModules);
        updateModuleCache(cachedModules);
      } else {
        console.log("No modules found in cache");
      }

      const cachedFeatures = loadFeaturesFromCache();
      if (cachedFeatures) {
        setFeatures(cachedFeatures);
      }

      // Charger les données fraîches
      try {
        const [modules, featuresData] = await Promise.all([
          refreshModules(true),
          refreshFeatures(true)
        ]);
        
        console.log(`Initialized with ${modules.length} modules from Supabase`);
        setInternalModules(modules);
        setFeatures(featuresData);
      } catch (err) {
        console.error("Erreur lors du chargement initial des données:", err);
      }

      setIsInitialized(true);
      setLoading(false);
    };

    // Configurer Supabase Realtime
    const channel = setupModuleRealtimeChannel(
      () => refreshModules(true),
      () => refreshFeatures(true)
    );

    // Initialiser
    initializeModule();

    // Nettoyage
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isInitialized, refreshModules, refreshFeatures]);

  return {
    // Fonctions asynchrones
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    
    // Fonctions synchrones
    getModuleActiveStatus,
    getModuleDegradedStatus,
    getFeatureEnabledStatus,
    
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
