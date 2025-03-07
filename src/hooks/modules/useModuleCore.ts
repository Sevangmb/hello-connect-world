
/**
 * Core functionality for modules system
 * This file contains the main hook for modules management
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { useModuleDataFetcher, ConnectionStatus } from "./fetcher";
import { useStatusManager } from "./statusManager";
import { useModuleActive } from "./useModuleActive";
import { useModuleEffects } from "./useModuleEffects";
import { useModuleApi } from "./ModuleApiContext";
import { AppModule } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { fetchModulesWithCache, fetchModulesFromApi } from "./services/ModuleFetcherService";
import { 
  loadModulesFromLocalStorage, 
  loadModulesFromSupabase,
  saveModulesToLocalStorage,
  initAttemptRef,
  isMountedRef,
  initialLoadAttemptedRef
} from "./services/ModuleInitializationService";

/**
 * Main hook for module management
 * Provides all functions needed to interact with modules
 */
export const useModuleCore = () => {
  // Récupérer l'API des modules depuis le contexte
  const moduleApi = useModuleApi();
  
  // État local pour les modules
  const [localModules, setLocalModules] = useState<AppModule[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [forcedInitComplete, setForcedInitComplete] = useState(false);
  
  // Récupérer les données des modules et dépendances
  const {
    modules,
    setModules,
    dependencies,
    setDependencies,
    features,
    setFeatures,
    loading,
    error,
    fetchModules: dataFetcherFetchModules,
    fetchDependencies,
    fetchFeatures,
    connectionStatus
  } = useModuleDataFetcher();

  // Optimiser le chargement avec une fonction mémoïsée
  const cachedFetchModules = useCallback(async (force = false) => {
    return await fetchModulesWithCache(force, modules);
  }, [modules]);

  // Obtenir les fonctions de gestion des statuts
  const {
    updateModuleStatus: updateModule,
    updateFeatureStatus: updateFeature,
    updateFeatureStatusSilent: updateFeatureSilent
  } = useStatusManager();

  // Obtenir les fonctions de vérification d'activité des modules
  const {
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled
  } = useModuleActive(modules, features);

  // Configurer les effets et abonnements, empêcher les rechargements multiples
  useModuleEffects(modules, setModules, cachedFetchModules, fetchDependencies, fetchFeatures);

  // Utiliser les modules du cache si disponibles, sinon charger depuis Supabase
  useEffect(() => {
    // Éviter les initialisations multiples
    if (initialLoadAttemptedRef.current || isInitialized) return;
    initialLoadAttemptedRef.current = true;
    
    const initializeModules = async () => {
      try {
        if (!isInitialized && isMountedRef.current) {
          console.log("Initialisation des modules dans useModuleCore");
          
          // Essayer d'abord de charger depuis le localStorage pour un chargement ultra-rapide
          const cachedModules = loadModulesFromLocalStorage();
          if (cachedModules.length > 0) {
            if (isMountedRef.current) {
              setLocalModules(cachedModules);
              setModules(cachedModules);
            }
          }
          
          // Essayer ensuite l'API des modules, mais pas si on a déjà des modules du cache
          if (localModules.length === 0 && !moduleApi.loading && moduleApi.isInitialized) {
            const modulesData = await fetchModulesFromApi(moduleApi, initAttemptRef.current > 1);
            console.log("Modules chargés depuis l'API:", modulesData?.length || 0);
            
            if (modulesData && modulesData.length > 0 && isMountedRef.current) {
              setLocalModules(modulesData);
              setModules(modulesData);
            } else {
              // Essayer de charger directement depuis le fetcher si l'API échoue
              const directModules = await cachedFetchModules();
              console.log("Modules chargés directement:", directModules?.length || 0);
              if (isMountedRef.current) {
                setLocalModules(directModules);
              }
            }
          } else if (localModules.length === 0) {
            // Si l'API n'est pas prête ou aucun module du cache, charger directement
            console.log("API non prête ou aucun module du cache, chargement direct des modules");
            const directModules = await cachedFetchModules();
            console.log("Modules chargés directement:", directModules?.length || 0);
            if (isMountedRef.current) {
              setLocalModules(directModules);
            }
          }
          
          if (isMountedRef.current) {
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation des modules:", error);
        // Essayer de continuer même en cas d'erreur
        if (isMountedRef.current) {
          setIsInitialized(true);
        }
      }
    };
    
    initializeModules();
    
    // Force initialization to complete after a timeout
    const timer = setTimeout(() => {
      if (!isInitialized && isMountedRef.current) {
        console.log("Forcing initialization completion after timeout");
        setIsInitialized(true);
        setForcedInitComplete(true);
      }
    }, 2000); // Réduit de 3000 à 2000ms pour améliorer les performances perçues
    
    return () => clearTimeout(timer);
  }, [moduleApi, setModules, isInitialized, cachedFetchModules, localModules.length]);
  
  // En cas d'erreur ou si les modules sont vides après un certain temps, essayer de recharger
  useEffect(() => {
    // Utilisez une variable locale au lieu de useRef
    let rechargementAttempted = false;
    
    if (isInitialized && isMountedRef.current && (localModules.length === 0 || modules.length === 0) && !rechargementAttempted) {
      rechargementAttempted = true;
      
      const timer = setTimeout(async () => {
        console.log("Tentative de rechargement des modules après timeout");
        try {
          const directModules = await cachedFetchModules(true); // Force refresh
          if (directModules.length > 0 && isMountedRef.current) {
            setLocalModules(directModules);
            setModules(directModules);
          } else if (forcedInitComplete && isMountedRef.current) {
            // If we completed initialization via timeout and still don't have modules,
            // try one more direct fetch from Supabase
            const backupModules = await loadModulesFromSupabase();
            if (backupModules.length > 0 && isMountedRef.current) {
              console.log("Modules chargés via fetch de secours:", backupModules.length);
              setLocalModules(backupModules);
              setModules(backupModules);
            }
          }
        } catch (e) {
          console.error("Erreur lors du rechargement des modules:", e);
        }
      }, 1500); // Réduit de 2000 à 1500ms
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized, localModules.length, modules.length, cachedFetchModules, setModules, forcedInitComplete]);

  // Nettoyer lors du démontage du composant
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Mémoïser les modules pour de meilleures performances et éviter les re-rendus inutiles
  const memoizedModules = useMemo(() => 
    localModules.length > 0 ? localModules : modules, 
    [localModules, modules]
  );

  return {
    modules: memoizedModules,
    dependencies,
    loading: loading || moduleApi.loading,
    error: error || moduleApi.error,
    features,
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    updateModule,
    updateFeature,
    updateFeatureSilent,
    fetchModules: cachedFetchModules,
    fetchDependencies,
    fetchFeatures,
    setModules,
    connectionStatus
  };
};
