
import { useState, useEffect } from "react";
import { AppModule, ModuleDependency } from "./types";
import { 
  fetchModulesRealtime, 
  fetchDependenciesRealtime, 
  fetchFeatureFlagsRealtime 
} from "./subscriptions";
import { combineModulesWithFeatures, getFullModulesFromCache } from "./utils";
import { supabase } from "@/integrations/supabase/client";

export const useModuleDataFetcher = () => {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [dependencies, setDependencies] = useState<ModuleDependency[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);

  // Essayer de charger depuis le cache au démarrage
  useEffect(() => {
    const loadFromCache = () => {
      const cachedModules = getFullModulesFromCache();
      if (cachedModules && cachedModules.length > 0) {
        console.log("Modules chargés depuis le cache:", cachedModules.length);
        setModules(cachedModules);
      }
    };
    
    loadFromCache();
  }, []);

  /**
   * Récupérer tous les modules depuis l'API
   */
  const fetchModules = async (): Promise<AppModule[]> => {
    try {
      setLoading(true);
      setFetchAttempts(prev => prev + 1);
      
      // Si après plusieurs tentatives, toujours pas de résultats, essayer une méthode alternative
      if (fetchAttempts > 2) {
        console.log("Tentative alternative de chargement des modules après échecs précédents");
        try {
          // Essayer de charger directement via Supabase
          const { data: directData, error: directError } = await supabase
            .from('app_modules')
            .select('*')
            .order('name');
            
          if (!directError && directData && directData.length > 0) {
            console.log("Modules chargés via méthode alternative:", directData.length);
            
            // Si nous avons déjà des features, les combiner avec les modules
            if (Object.keys(features).length > 0) {
              const combinedModules = combineModulesWithFeatures(directData, features);
              setModules(combinedModules);
              return combinedModules;
            } else {
              setModules(directData);
              return directData;
            }
          }
        } catch (altErr) {
          console.error("Erreur lors du chargement alternatif des modules:", altErr);
        }
      }
      
      // Méthode principale via le service realtime
      const modulesData = await fetchModulesRealtime();
      
      // Si nous avons déjà des features, les combiner avec les modules
      if (Object.keys(features).length > 0) {
        const combinedModules = combineModulesWithFeatures(modulesData, features);
        setModules(combinedModules);
        return combinedModules;
      } else {
        setModules(modulesData);
        return modulesData;
      }
    } catch (err: any) {
      console.error("Error fetching modules:", err);
      setError(err.message || "Failed to fetch modules");
      
      // En cas d'erreur, retourner les modules du cache ou un tableau vide
      return modules.length > 0 ? modules : [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer toutes les dépendances des modules
   */
  const fetchDependencies = async (): Promise<ModuleDependency[]> => {
    try {
      setLoading(true);
      const dependenciesData = await fetchDependenciesRealtime();
      setDependencies(dependenciesData);
      return dependenciesData;
    } catch (err: any) {
      console.error("Error fetching dependencies:", err);
      setError(err.message || "Failed to fetch dependencies");
      return dependencies.length > 0 ? dependencies : [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer tous les feature flags
   */
  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const featuresData = await fetchFeatureFlagsRealtime();
      setFeatures(featuresData);
      
      // Mettre à jour les modules avec les nouvelles features
      if (modules.length > 0) {
        setModules(combineModulesWithFeatures(modules, featuresData));
      }
      
      return featuresData;
    } catch (err: any) {
      console.error("Error fetching features:", err);
      setError(err.message || "Failed to fetch features");
      return features;
    } finally {
      setLoading(false);
    }
  };

  return {
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
    fetchFeatures
  };
};
