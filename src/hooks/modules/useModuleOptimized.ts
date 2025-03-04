
/**
 * Hook optimisé pour la gestion des modules avec chargement prioritaire
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useModulePriority } from "./hooks/useModulePriority";
import { AppModule } from "./types";
import { moduleOptimizer } from "@/services/performance/ModuleOptimizer";

// Vérifier rapidement si un module est actif depuis le cache
const isModuleActiveCached = (moduleCode: string): boolean => {
  // Admin toujours actif
  if (moduleCode === "admin" || moduleCode.startsWith("admin_")) {
    return true;
  }

  try {
    const statusCache = sessionStorage.getItem("module_statuses");
    if (statusCache) {
      const statuses = JSON.parse(statusCache) as Record<string, string>;
      return statuses[moduleCode] === "active";
    }
  } catch (e) {
    // Ignorer les erreurs
  }

  // Fallback plus lent
  try {
    const modulesCache = localStorage.getItem("modules_cache");
    if (modulesCache) {
      const modules = JSON.parse(modulesCache) as AppModule[];
      const module = modules.find(m => m.code === moduleCode);
      return module?.status === "active";
    }
  } catch (e) {
    // Ignorer les erreurs
  }

  return false;
};

export const useModuleOptimized = () => {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [error, setError] = useState<any>(null);
  const [dependencies, setDependencies] = useState<any[]>([]);
  const { priorityModules, isInitialized, optimizeModules } = useModulePriority();

  // Utiliser les modules prioritaires pour un chargement initial rapide
  useEffect(() => {
    if (priorityModules.length > 0 && modules.length === 0) {
      setModules(priorityModules);
      setLoading(false);
    }
  }, [priorityModules, modules.length]);

  // Récupérer tous les modules avec optimisation
  const fetchModules = useCallback(async () => {
    try {
      // Si le cache est valide, l'utiliser d'abord pour une réponse immédiate
      if (moduleOptimizer.isCacheValid() && modules.length === 0) {
        const cachedModules = localStorage.getItem("modules_cache");
        if (cachedModules) {
          const parsedModules = JSON.parse(cachedModules) as AppModule[];
          setModules(parsedModules);
          setLoading(false);
        }
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("app_modules")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      // Optimiser l'ordre des modules
      const optimizedModules = optimizeModules(data as AppModule[]);
      setModules(optimizedModules);
      
      return optimizedModules;
    } catch (err) {
      console.error("Erreur lors du chargement des modules:", err);
      setError(err.message);
      
      // En cas d'erreur, conserver les modules existants
      return modules;
    } finally {
      setLoading(false);
    }
  }, [modules, optimizeModules]);

  // Récupérer les fonctionnalités avec mise en cache efficace
  const fetchFeatures = useCallback(async () => {
    try {
      // Vérifier d'abord le cache
      const cachedFeatures = localStorage.getItem("features_cache");
      const cacheTime = localStorage.getItem("features_cache_time");
      
      // Utiliser le cache si valide (moins de 15 minutes)
      if (cachedFeatures && cacheTime && Date.now() - parseInt(cacheTime) < 15 * 60 * 1000) {
        const parsedFeatures = JSON.parse(cachedFeatures);
        setFeatures(parsedFeatures);
        return parsedFeatures;
      }

      const { data, error } = await supabase
        .from("module_features")
        .select("*");
      
      if (error) throw error;
      
      // Organiser les fonctionnalités par module
      const featuresData: Record<string, Record<string, boolean>> = {};
      data.forEach(feature => {
        if (!featuresData[feature.module_code]) {
          featuresData[feature.module_code] = {};
        }
        featuresData[feature.module_code][feature.feature_code] = feature.is_enabled;
      });
      
      // Mettre en cache
      localStorage.setItem("features_cache", JSON.stringify(featuresData));
      localStorage.setItem("features_cache_time", Date.now().toString());
      
      setFeatures(featuresData);
      return featuresData;
    } catch (err) {
      console.error("Erreur lors du chargement des fonctionnalités:", err);
      setError(err.message);
      return features;
    }
  }, [features]);

  // Vérifier si un module est actif (version optimisée)
  const isModuleActive = useCallback((moduleCode: string): boolean => {
    // Vérifier d'abord rapidement dans le cache
    return isModuleActiveCached(moduleCode);
  }, []);

  // Initialiser les données au montage avec chargement intelligent
  useEffect(() => {
    const loadData = async () => {
      // Si nous avons déjà des modules prioritaires, différer le chargement complet
      if (priorityModules.length > 0) {
        setTimeout(() => {
          fetchModules().then(() => {
            fetchFeatures();
          });
        }, 1000); // Charger après l'affichage initial pour améliorer l'expérience
      } else {
        // Sinon charger immédiatement
        await fetchModules();
        await fetchFeatures();
      }
    };
    
    loadData();
    
    // Rafraîchir les modules moins fréquemment (2 minutes)
    const refreshInterval = setInterval(() => {
      fetchModules();
    }, 120000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchModules, fetchFeatures, priorityModules.length]);

  return {
    loading,
    error,
    modules,
    dependencies,
    features,
    isModuleActive,
    fetchModules,
    fetchFeatures,
    isInitialized
  };
};
