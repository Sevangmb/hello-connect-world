
import { useState } from "react";
import { AppModule, ModuleDependency } from "./types";
import { 
  fetchModulesRealtime, 
  fetchDependenciesRealtime, 
  fetchFeatureFlagsRealtime 
} from "./subscriptions";
import { combineModulesWithFeatures } from "./utils";

export const useModuleDataFetcher = () => {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [dependencies, setDependencies] = useState<ModuleDependency[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupérer tous les modules depuis l'API
   */
  const fetchModules = async (): Promise<AppModule[]> => {
    try {
      setLoading(true);
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
      return [];
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
      return [];
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
      return {};
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
