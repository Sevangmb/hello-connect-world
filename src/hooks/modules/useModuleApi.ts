
/**
 * API flexible pour accéder aux modules
 * Ce hook fournit une API unifiée pour accéder aux modules depuis n'importe quel composant
 */

import { useState, useEffect, useCallback } from 'react';
import { AppModule, ModuleStatus } from './types';
import { supabase } from '@/integrations/supabase/client';
import { getModuleStatusesFromCache, getFullModulesFromCache, cacheFullModules } from './utils';
import { broadcastModuleStatusChange } from './tabSync';
import { triggerModuleStatusChanged, onModuleStatusChanged } from './events';

// Identifiant pour le module Admin qui doit toujours être actif
const ADMIN_MODULE_CODE = 'admin';

// Stocker les modules en mémoire pour un accès encore plus rapide entre les composants
let inMemoryModulesCache: AppModule[] | null = null;
let inMemoryFeaturesCache: Record<string, Record<string, boolean>> | null = null;
let lastFetchTimestamp = 0;

/**
 * API flexible pour accéder aux données des modules et fonctionnalités
 */
export const useModuleApi = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Vérifie si un module est actif
   * Utilise le cache et effectue une vérification en temps réel si nécessaire
   */
  const isModuleActive = useCallback(async (moduleCode: string): Promise<boolean> => {
    // Si c'est le module Admin, toujours retourner true
    if (moduleCode === ADMIN_MODULE_CODE) return true;

    // Essayer d'abord le cache en mémoire
    if (inMemoryModulesCache) {
      const module = inMemoryModulesCache.find(m => m.code === moduleCode);
      if (module) {
        return module.status === 'active';
      }
    }

    // Essayer ensuite le cache localStorage
    const cachedStatuses = getModuleStatusesFromCache();
    if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
      return cachedStatuses[moduleCode] === 'active';
    }

    // Si pas de cache ou module non trouvé, charger depuis Supabase
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('status')
        .eq('code', moduleCode)
        .single();

      if (error) {
        console.error('Erreur lors de la vérification du statut du module:', error);
        return false;
      }

      return data?.status === 'active';
    } catch (e) {
      console.error('Exception lors de la vérification du statut du module:', e);
      return false;
    }
  }, []);

  /**
   * Vérifie si un module est en mode dégradé
   * Utilise le cache et effectue une vérification en temps réel si nécessaire
   */
  const isModuleDegraded = useCallback(async (moduleCode: string): Promise<boolean> => {
    // Si c'est le module Admin, jamais en mode dégradé
    if (moduleCode === ADMIN_MODULE_CODE) return false;

    // Essayer d'abord le cache en mémoire
    if (inMemoryModulesCache) {
      const module = inMemoryModulesCache.find(m => m.code === moduleCode);
      if (module) {
        return module.status === 'degraded';
      }
    }

    // Essayer ensuite le cache localStorage
    const cachedStatuses = getModuleStatusesFromCache();
    if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
      return cachedStatuses[moduleCode] === 'degraded';
    }

    // Si pas de cache ou module non trouvé, charger depuis Supabase
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('status')
        .eq('code', moduleCode)
        .single();

      if (error) {
        console.error('Erreur lors de la vérification du statut du module:', error);
        return false;
      }

      return data?.status === 'degraded';
    } catch (e) {
      console.error('Exception lors de la vérification du statut du module:', e);
      return false;
    }
  }, []);

  /**
   * Vérifie si une fonctionnalité spécifique d'un module est activée
   * Utilise le cache et effectue une vérification en temps réel si nécessaire
   */
  const isFeatureEnabled = useCallback(async (moduleCode: string, featureCode: string): Promise<boolean> => {
    // Si c'est le module Admin, toujours activer ses fonctionnalités
    if (moduleCode === ADMIN_MODULE_CODE) return true;

    // Vérifier d'abord si le module est actif
    const moduleActive = await isModuleActive(moduleCode);
    if (!moduleActive) return false;

    // Essayer d'abord le cache en mémoire pour les fonctionnalités
    if (inMemoryFeaturesCache && inMemoryFeaturesCache[moduleCode]) {
      const featureEnabled = inMemoryFeaturesCache[moduleCode][featureCode];
      if (featureEnabled !== undefined) {
        return featureEnabled;
      }
    }

    // Si pas en mémoire, charger depuis Supabase
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('is_enabled')
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode)
        .single();

      if (error) {
        console.error('Erreur lors de la vérification du statut de la fonctionnalité:', error);
        return false;
      }

      return data?.is_enabled || false;
    } catch (e) {
      console.error('Exception lors de la vérification du statut de la fonctionnalité:', e);
      return false;
    }
  }, [isModuleActive]);

  /**
   * Fonction synchrone pour vérifier rapidement le statut d'un module
   * Utilise uniquement le cache, pour une utilisation dans les rendus React
   */
  const getModuleActiveStatus = useCallback((moduleCode: string): boolean => {
    // Si c'est le module Admin, toujours retourner true
    if (moduleCode === ADMIN_MODULE_CODE) return true;

    // Essayer d'abord le cache en mémoire
    if (inMemoryModulesCache) {
      const module = inMemoryModulesCache.find(m => m.code === moduleCode);
      if (module) {
        return module.status === 'active';
      }
    }

    // Essayer ensuite le cache localStorage
    const cachedStatuses = getModuleStatusesFromCache();
    if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
      return cachedStatuses[moduleCode] === 'active';
    }

    // Par défaut, considérer inactif si pas de cache
    return false;
  }, []);

  /**
   * Fonction synchrone pour vérifier rapidement si un module est dégradé
   * Utilise uniquement le cache, pour une utilisation dans les rendus React
   */
  const getModuleDegradedStatus = useCallback((moduleCode: string): boolean => {
    // Si c'est le module Admin, jamais en mode dégradé
    if (moduleCode === ADMIN_MODULE_CODE) return false;

    // Essayer d'abord le cache en mémoire
    if (inMemoryModulesCache) {
      const module = inMemoryModulesCache.find(m => m.code === moduleCode);
      if (module) {
        return module.status === 'degraded';
      }
    }

    // Essayer ensuite le cache localStorage
    const cachedStatuses = getModuleStatusesFromCache();
    if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
      return cachedStatuses[moduleCode] === 'degraded';
    }

    // Par défaut, considérer non-dégradé si pas de cache
    return false;
  }, []);

  /**
   * Fonction synchrone pour vérifier rapidement si une fonctionnalité est activée
   * Utilise uniquement le cache, pour une utilisation dans les rendus React
   */
  const getFeatureEnabledStatus = useCallback((moduleCode: string, featureCode: string): boolean => {
    // Si c'est le module Admin, toujours activer ses fonctionnalités
    if (moduleCode === ADMIN_MODULE_CODE) return true;

    // Vérifier d'abord si le module est actif
    const moduleActive = getModuleActiveStatus(moduleCode);
    if (!moduleActive) return false;

    // Essayer le cache en mémoire pour les fonctionnalités
    if (inMemoryFeaturesCache && inMemoryFeaturesCache[moduleCode]) {
      const featureEnabled = inMemoryFeaturesCache[moduleCode][featureCode];
      if (featureEnabled !== undefined) {
        return featureEnabled;
      }
    }

    // Par défaut, considérer désactivé si pas de cache
    return false;
  }, [getModuleActiveStatus]);

  /**
   * Rafraîchit tous les modules depuis Supabase
   */
  const refreshModules = useCallback(async (force = false): Promise<AppModule[]> => {
    const now = Date.now();

    // Si on a récemment chargé les modules et que ce n'est pas un rafraîchissement forcé,
    // utiliser le cache en mémoire
    if (inMemoryModulesCache && !force && (now - lastFetchTimestamp < 30000)) {
      return inMemoryModulesCache;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erreur lors du chargement des modules:', error);
        setError(error.message);
        return inMemoryModulesCache || [];
      }

      // S'assurer que le module Admin est toujours actif
      const modulesData = data.map(module => {
        if (module.code === ADMIN_MODULE_CODE && module.status !== 'active') {
          // Réparer automatiquement
          supabase
            .from('app_modules')
            .update({ status: 'active', updated_at: new Date().toISOString() })
            .eq('id', module.id)
            .then(() => {
              console.log('Module Admin réactivé automatiquement');
            });
          return { ...module, status: 'active' };
        }
        return module;
      });

      // Mettre à jour le cache
      inMemoryModulesCache = modulesData;
      lastFetchTimestamp = now;
      cacheFullModules(modulesData);

      return modulesData;
    } catch (e: any) {
      console.error('Exception lors du chargement des modules:', e);
      setError(e.message || 'Erreur lors du chargement des modules');
      return inMemoryModulesCache || [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rafraîchit toutes les fonctionnalités depuis Supabase
   */
  const refreshFeatures = useCallback(async (force = false): Promise<Record<string, Record<string, boolean>>> => {
    const now = Date.now();

    // Si on a récemment chargé les fonctionnalités et que ce n'est pas un rafraîchissement forcé,
    // utiliser le cache en mémoire
    if (inMemoryFeaturesCache && !force && (now - lastFetchTimestamp < 30000)) {
      return inMemoryFeaturesCache;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('module_features')
        .select('*');

      if (error) {
        console.error('Erreur lors du chargement des fonctionnalités:', error);
        setError(error.message);
        return inMemoryFeaturesCache || {};
      }

      // Organiser les fonctionnalités par module
      const featuresData: Record<string, Record<string, boolean>> = {};
      
      data.forEach(feature => {
        // S'assurer que les fonctionnalités Admin sont toujours activées
        if (feature.module_code === ADMIN_MODULE_CODE && !feature.is_enabled) {
          // Réparer automatiquement
          supabase
            .from('module_features')
            .update({ is_enabled: true, updated_at: new Date().toISOString() })
            .eq('id', feature.id)
            .then(() => {
              console.log('Fonctionnalité Admin réactivée automatiquement');
            });
          feature.is_enabled = true;
        }
        
        if (!featuresData[feature.module_code]) {
          featuresData[feature.module_code] = {};
        }
        featuresData[feature.module_code][feature.feature_code] = feature.is_enabled;
      });

      // Mettre à jour le cache
      inMemoryFeaturesCache = featuresData;
      try {
        localStorage.setItem('app_features_cache', JSON.stringify(featuresData));
        localStorage.setItem('app_features_cache_timestamp', now.toString());
      } catch (e) {
        console.error('Erreur lors de la mise en cache des fonctionnalités:', e);
      }

      return featuresData;
    } catch (e: any) {
      console.error('Exception lors du chargement des fonctionnalités:', e);
      setError(e.message || 'Erreur lors du chargement des fonctionnalités');
      return inMemoryFeaturesCache || {};
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Met à jour le statut d'un module
   */
  const updateModuleStatus = useCallback(async (moduleId: string, status: ModuleStatus): Promise<boolean> => {
    // Vérifier si le module est le module Admin
    if (inMemoryModulesCache) {
      const moduleToUpdate = inMemoryModulesCache.find(m => m.id === moduleId);
      if (moduleToUpdate && moduleToUpdate.code === ADMIN_MODULE_CODE && status !== 'active') {
        console.error("Le module Admin ne peut pas être désactivé");
        return false;
      }
    }

    try {
      const { error } = await supabase
        .from('app_modules')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', moduleId);

      if (error) {
        console.error('Erreur lors de la mise à jour du statut du module:', error);
        return false;
      }

      // Mettre à jour le cache en mémoire si disponible
      if (inMemoryModulesCache) {
        inMemoryModulesCache = inMemoryModulesCache.map(module => {
          if (module.id === moduleId) {
            return { ...module, status };
          }
          return module;
        });
        // Mettre à jour le cache localStorage
        cacheFullModules(inMemoryModulesCache);
      }

      // Diffuser le changement à tous les onglets
      broadcastModuleStatusChange(moduleId, status);
      triggerModuleStatusChanged();

      // Rafraîchir les données
      await refreshModules(true);

      return true;
    } catch (e) {
      console.error('Exception lors de la mise à jour du statut du module:', e);
      return false;
    }
  }, [refreshModules]);

  /**
   * Met à jour le statut d'une fonctionnalité
   */
  const updateFeatureStatus = useCallback(async (
    moduleCode: string, 
    featureCode: string, 
    isEnabled: boolean
  ): Promise<boolean> => {
    // Vérifier si c'est une fonctionnalité du module Admin
    if (moduleCode === ADMIN_MODULE_CODE && !isEnabled) {
      console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
      return false;
    }

    try {
      const { error } = await supabase
        .from('module_features')
        .update({ 
          is_enabled: isEnabled, 
          updated_at: new Date().toISOString() 
        })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);

      if (error) {
        console.error('Erreur lors de la mise à jour du statut de la fonctionnalité:', error);
        return false;
      }

      // Mettre à jour le cache en mémoire si disponible
      if (inMemoryFeaturesCache) {
        const updatedFeatures = { ...inMemoryFeaturesCache };
        if (!updatedFeatures[moduleCode]) {
          updatedFeatures[moduleCode] = {};
        }
        updatedFeatures[moduleCode][featureCode] = isEnabled;
        inMemoryFeaturesCache = updatedFeatures;
        
        // Mettre à jour le cache localStorage
        try {
          localStorage.setItem('app_features_cache', JSON.stringify(updatedFeatures));
          localStorage.setItem('app_features_cache_timestamp', Date.now().toString());
        } catch (e) {
          console.error('Erreur lors de la mise en cache des fonctionnalités:', e);
        }
      }

      // Rafraîchir les données
      await refreshFeatures(true);

      return true;
    } catch (e) {
      console.error('Exception lors de la mise à jour du statut de la fonctionnalité:', e);
      return false;
    }
  }, [refreshFeatures]);

  // Initialiser le cache et configurer les abonnements temps réel
  useEffect(() => {
    if (isInitialized) return;

    const initializeCache = async () => {
      // Essayer d'abord de charger depuis le cache localStorage
      const cachedModules = getFullModulesFromCache();
      if (cachedModules) {
        inMemoryModulesCache = cachedModules;
        console.log('Modules chargés depuis le cache localStorage');
      }

      // Essayer de charger les fonctionnalités depuis le cache localStorage
      try {
        const cachedFeatures = localStorage.getItem('app_features_cache');
        const featuresTimestamp = localStorage.getItem('app_features_cache_timestamp');
        
        if (cachedFeatures && featuresTimestamp) {
          const now = Date.now();
          const cacheTime = parseInt(featuresTimestamp, 10);
          
          if (now - cacheTime <= 5 * 60 * 1000) { // 5 minutes
            inMemoryFeaturesCache = JSON.parse(cachedFeatures);
            console.log('Fonctionnalités chargées depuis le cache localStorage');
          }
        }
      } catch (e) {
        console.error('Erreur lors du chargement des fonctionnalités depuis le cache:', e);
      }

      // Charger les données fraîches depuis Supabase
      await Promise.all([
        refreshModules(true),
        refreshFeatures(true)
      ]);

      setIsInitialized(true);
      setLoading(false);
    };

    // Configurer les abonnements Supabase Realtime
    const channel = supabase.channel('module-api-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'app_modules'
      }, () => {
        console.log('Changement détecté dans les modules, rafraîchissement...');
        refreshModules(true);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'module_features'
      }, () => {
        console.log('Changement détecté dans les fonctionnalités, rafraîchissement...');
        refreshFeatures(true);
      })
      .subscribe();

    // Écouter les événements de changement de statut des modules
    const handleModuleStatusChanged = () => {
      refreshModules(true);
    };
    
    // S'abonner à l'événement
    const cleanup = onModuleStatusChanged(handleModuleStatusChanged);

    // Initialiser le cache
    initializeCache();

    // Nettoyage à la destruction du composant
    return () => {
      cleanup();
      supabase.removeChannel(channel);
    };
  }, [isInitialized, refreshModules, refreshFeatures]);

  return {
    // Fonctions asynchrones pour les vérifications précises
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    
    // Fonctions synchrones pour les rendus React (utilisent le cache seulement)
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
    isInitialized
  };
};
