
import { useEffect } from 'react';
import { loadModulesFromCache, loadFeaturesFromCache } from '../api/moduleCache';
import { updateModuleCache } from '../api/moduleStatus';
import { setupModuleRealtimeChannel } from '../api/moduleSync';
import { supabase } from '@/integrations/supabase/client';
import { AppModule } from '../types';

// Cache global des initialisations pour éviter des rechargements multiples
const initializedModules: Record<string, boolean> = {};

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
    
    // Si nous avons déjà des modules en cache, marquer comme initialisé plus rapidement
    if (!isInitialized) {
      setIsInitialized(true);
      setLoading(false);
    }
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

  // Vérifier si nous avons déjà initialisé cette session
  const sessionKey = 'module_api_initialized';
  const alreadyInitialized = initializedModules[sessionKey];
  
  // Chargement différé des données fraîches pour améliorer les performances
  if (!alreadyInitialized) {
    // Marquer comme initialisé
    initializedModules[sessionKey] = true;
    
    // Utiliser setTimeout pour charger les données fraîches après le rendu initial
    setTimeout(() => {
      Promise.all([
        refreshModules(),
        refreshFeatures(false) // Utiliser le cache si disponible
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
    }, 100); // Petit délai pour laisser l'interface se charger d'abord
  }

  // Retourner la fonction de nettoyage
  return {
    cleanupFunction: () => {
      supabase.removeChannel(channel);
    }
  };
};
