
import { useEffect } from 'react';
import { loadModulesFromCache, loadFeaturesFromCache } from '../api/moduleCache';
import { updateModuleCache } from '../api/moduleStatus';
import { setupModuleRealtimeChannel } from '../api/moduleSync';
import { supabase } from '@/integrations/supabase/client';
import { AppModule } from '../types';

/**
 * Initialise le module API et configure les abonnements
 */
export const initializeModuleApi = (
  isInitialized: boolean,
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>,
  setInternalModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
  setFeatures: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  refreshModules: () => Promise<AppModule[]>,
  refreshFeatures: (force?: boolean) => Promise<Record<string, Record<string, boolean>>>
): { cleanupFunction: () => void } => {
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

  // Configurer Supabase Realtime
  const channel = setupModuleRealtimeChannel(
    () => refreshModules(),
    () => refreshFeatures(true)
  );

  // Charger les données fraîches
  Promise.all([
    refreshModules(),
    refreshFeatures(true)
  ]).then(([modules, featuresData]) => {
    console.log(`Initialized with ${modules.length} modules from Supabase`);
    setInternalModules(modules);
    setFeatures(featuresData);
    setIsInitialized(true);
    setLoading(false);
  }).catch(err => {
    console.error("Erreur lors du chargement initial des données:", err);
    setIsInitialized(true);
    setLoading(false);
  });

  // Retourner la fonction de nettoyage
  return {
    cleanupFunction: () => {
      supabase.removeChannel(channel);
    }
  };
};
