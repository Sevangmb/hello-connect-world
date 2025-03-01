
/**
 * Hook principal pour la gestion des modules dans l'application
 * Ce hook est un point d'entrée public qui agrège plusieurs hooks spécialisés
 */

import { useModuleCore } from "./useModuleCore";
import { useModuleStatusUpdate } from "./useModuleStatusUpdate";
import { ModuleStatus } from "./types";
import { useEffect, useState } from "react";
import { getModuleStatusFromCache } from "./api/moduleStatusCore";
import { supabase } from "@/integrations/supabase/client";

// Constante pour identifier le module Admin
export const ADMIN_MODULE_CODE = "admin";

// Cache en mémoire pour éviter des recalculs fréquents
const isActiveCache: Record<string, { value: boolean, timestamp: number }> = {};
const isDegradedCache: Record<string, { value: boolean, timestamp: number }> = {};
const CACHE_VALIDITY_MS = 30000; // 30 secondes

export const useModules = () => {
  // État pour suivre les initialisations
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Récupérer les fonctionnalités de base
  const {
    modules,
    dependencies,
    loading,
    error,
    features,
    isModuleActive: baseIsModuleActive,
    isModuleDegraded: baseIsModuleDegraded,
    isFeatureEnabled: baseIsFeatureEnabled,
    updateModule,
    updateFeature,
    updateFeatureSilent,
    fetchModules,
    fetchDependencies,
    setModules,
    connectionStatus
  } = useModuleCore();

  // Récupérer les fonctions de mise à jour de statut
  const {
    updateModuleStatus: updateModuleStatusFn,
    updateFeatureStatus: updateFeatureStatusFn,
    updateFeatureStatusSilent: updateFeatureStatusSilentFn
  } = useModuleStatusUpdate();

  // Forcer le chargement initial des modules
  useEffect(() => {
    if (!isInitialized && modules.length === 0) {
      console.log("useModules: Initialisation forcée des modules");
      fetchModules().then(loadedModules => {
        if (loadedModules.length === 0) {
          // Si toujours aucun module, essayer une requête Supabase directe
          console.log("useModules: Tentative de chargement direct depuis Supabase");
          supabase.from('app_modules')
            .select('*')
            .then(({ data, error }) => {
              if (error) {
                console.error("Erreur lors du chargement direct des modules:", error);
              }
              if (data && data.length > 0) {
                console.log(`useModules: ${data.length} modules chargés directement depuis Supabase`);
                // Convertir explicitement les statuts en ModuleStatus
                const validatedModules = data.map(module => ({
                  ...module,
                  status: (module.status === 'active' || module.status === 'inactive' || module.status === 'degraded') 
                    ? module.status as ModuleStatus 
                    : 'inactive' as ModuleStatus
                }));
                // Marquer tous les modules comme actifs
                const activatedModules = validatedModules.map(module => ({
                  ...module,
                  status: 'active' as ModuleStatus
                }));
                setModules(activatedModules);
              }
            });
        } else {
          // Marquer tous les modules comme actifs
          const activatedModules = loadedModules.map(module => ({
            ...module,
            status: 'active' as ModuleStatus
          }));
          setModules(activatedModules);
        }
        setIsInitialized(true);
      });
    }
  }, [modules, fetchModules, setModules, isInitialized]);

  // Surcharger isModuleActive pour toujours retourner true
  const isModuleActive = (moduleCode: string): boolean => {
    // Toujours retourner true pour que tous les modules soient considérés comme actifs
    return true;
  };

  // Surcharger isModuleDegraded pour toujours retourner false
  const isModuleDegraded = (moduleCode: string): boolean => {
    // Toujours retourner false pour qu'aucun module ne soit considéré comme dégradé
    return false;
  };

  // Surcharger isFeatureEnabled pour toujours retourner true
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    // Toujours retourner true pour que toutes les fonctionnalités soient considérées comme activées
    return true;
  };

  // Wrapper pour mettre à jour le statut d'un module
  const updateModuleStatus = async (moduleId: string, status: ModuleStatus) => {
    const moduleToUpdate = modules.find(m => m.id === moduleId);
    
    // Empêcher la désactivation du module Admin
    if (moduleToUpdate && (moduleToUpdate.code === ADMIN_MODULE_CODE || moduleToUpdate.code.startsWith('admin')) && status !== 'active') {
      console.error("Le module Admin ne peut pas être désactivé");
      return false;
    }
    
    const success = await updateModuleStatusFn(moduleId, status, modules, updateModule, setModules);
    
    // Invalider les caches
    if (moduleToUpdate) {
      delete isActiveCache[moduleToUpdate.code];
      delete isDegradedCache[moduleToUpdate.code];
    }
    
    // Forcer un rafraîchissement des modules après la mise à jour
    if (success) {
      await fetchModules();
    }
    
    return success;
  };

  // Wrapper pour mettre à jour le statut d'une fonctionnalité
  const updateFeatureStatus = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    // Empêcher la désactivation des fonctionnalités du module Admin
    if ((moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) && !isEnabled) {
      console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
      return false;
    }
    
    return updateFeatureStatusFn(moduleCode, featureCode, isEnabled, updateFeature, setModules, features);
  };

  // Wrapper pour mettre à jour le statut d'une fonctionnalité silencieusement
  const updateFeatureStatusSilent = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    // Empêcher la désactivation des fonctionnalités du module Admin
    if ((moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) && !isEnabled) {
      console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
      return false;
    }
    
    return updateFeatureStatusSilentFn(moduleCode, featureCode, isEnabled, updateFeatureSilent);
  };

  // Fonction de rafraîchissement explicite qui force la mise à jour depuis Supabase
  const refreshModules = async () => {
    console.log("useModules: Forçage du rafraîchissement des modules");
    
    // Invalider tous les caches
    Object.keys(isActiveCache).forEach(key => delete isActiveCache[key]);
    Object.keys(isDegradedCache).forEach(key => delete isDegradedCache[key]);
    
    const updatedModules = await fetchModules();
    console.log(`useModules: ${updatedModules.length} modules récupérés`);
    
    if (updatedModules.length === 0) {
      // Si aucun module n'est retourné, essayer directement avec Supabase
      try {
        const { data, error } = await supabase.from('app_modules').select('*');
        if (error) {
          console.error("Erreur lors de la récupération directe des modules:", error);
        } else if (data && data.length > 0) {
          console.log(`useModules: ${data.length} modules récupérés directement`);
          // Convertir explicitement les statuts en ModuleStatus
          const validatedModules = data.map(module => ({
            ...module,
            status: (module.status === 'active' || module.status === 'inactive' || module.status === 'degraded') 
              ? module.status as ModuleStatus 
              : 'inactive' as ModuleStatus
          }));
          setModules(validatedModules);
          return validatedModules;
        }
      } catch (e) {
        console.error("Erreur Supabase:", e);
      }
    }
    
    return updatedModules;
  };

  return {
    // États et données
    modules,
    dependencies,
    loading,
    error,
    
    // Fonctions de vérification - toujours retourner que tout est actif
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    
    // Fonctions de mise à jour
    updateModuleStatus,
    updateFeatureStatus,
    updateFeatureStatusSilent,
    
    // Fonctions de rafraîchissement
    refreshModules,
    refreshDependencies: fetchDependencies,
    
    // Statut de connexion
    connectionStatus,
    
    // État d'initialisation
    isInitialized
  };
};
