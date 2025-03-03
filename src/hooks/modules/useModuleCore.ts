/**
 * Core functionality for modules system
 * This file contains the main hook for modules management
 */

import { useEffect, useState } from "react";
import { useModuleDataFetcher, ConnectionStatus } from "./fetcher";
import { useStatusManager } from "./statusManager";
import { useModuleActive } from "./useModuleActive";
import { useModuleEffects } from "./useModuleEffects";
import { useModuleApiContext } from "./ModuleApiContext";
import { AppModule } from "./types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Main hook for module management
 * Provides all functions needed to interact with modules
 */
export const useModuleCore = () => {
  // Récupérer l'API des modules depuis le contexte
  const moduleApi = useModuleApiContext();
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
    fetchModules,
    fetchDependencies,
    fetchFeatures,
    connectionStatus
  } = useModuleDataFetcher();

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

  // Configurer les effets et abonnements
  useModuleEffects(modules, setModules, fetchModules, fetchDependencies, fetchFeatures);

  // Utiliser les modules du cache si disponibles, sinon charger depuis Supabase
  useEffect(() => {
    const initializeModules = async () => {
      try {
        if (!isInitialized) {
          console.log("Initialisation des modules dans useModuleCore");
          
          if (!moduleApi.loading && moduleApi.isInitialized) {
            const modulesData = await moduleApi.refreshModules(true);
            console.log("Modules chargés depuis l'API:", modulesData?.length || 0);
            
            if (modulesData && modulesData.length > 0) {
              setLocalModules(modulesData);
              setModules(modulesData);
            } else {
              // Essayer de charger directement depuis le fetcher
              const directModules = await fetchModules();
              console.log("Modules chargés directement:", directModules?.length || 0);
              setLocalModules(directModules);
            }
          } else {
            // Si l'API n'est pas prête, charger directement
            console.log("API non prête, chargement direct des modules");
            const directModules = await fetchModules();
            console.log("Modules chargés directement:", directModules?.length || 0);
            setLocalModules(directModules);
          }
          
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation des modules:", error);
        // Essayer de continuer même en cas d'erreur
        setIsInitialized(true);
      }
    };
    
    initializeModules();
    
    // Force initialization to complete after a timeout
    const timer = setTimeout(() => {
      if (!isInitialized) {
        console.log("Forcing initialization completion after timeout");
        setIsInitialized(true);
        setForcedInitComplete(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [moduleApi, setModules, isInitialized, fetchModules]);
  
  // En cas d'erreur ou si les modules sont vides après un certain temps, essayer de recharger
  useEffect(() => {
    if (isInitialized && (localModules.length === 0 || modules.length === 0)) {
      const timer = setTimeout(async () => {
        console.log("Tentative de rechargement des modules après timeout");
        try {
          const directModules = await fetchModules();
          if (directModules.length > 0) {
            setLocalModules(directModules);
            setModules(directModules);
          } else if (forcedInitComplete) {
            // If we completed initialization via timeout and still don't have modules,
            // try one more direct fetch from Supabase
            try {
              const { data } = await supabase
                .from('app_modules')
                .select('*')
                .order('name');
                
              if (data && data.length > 0) {
                // Ensure we have proper ModuleStatus types
                const typedModules = data.map(module => {
                  let status = module.status;
                  // Make sure status is a valid ModuleStatus
                  if (status !== 'active' && status !== 'inactive' && status !== 'degraded') {
                    status = 'inactive';
                  }
                  return { ...module, status } as AppModule;
                });
                
                console.log("Modules chargés via fetch de secours:", typedModules.length);
                setLocalModules(typedModules);
                setModules(typedModules);
              }
            } catch (e) {
              console.error("Erreur lors du fetch de secours:", e);
            }
          }
        } catch (e) {
          console.error("Erreur lors du rechargement des modules:", e);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized, localModules.length, modules.length, fetchModules, setModules, forcedInitComplete]);

  return {
    modules: localModules.length > 0 ? localModules : modules,
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
    fetchModules,
    fetchDependencies,
    fetchFeatures,
    setModules,
    connectionStatus
  };
};
