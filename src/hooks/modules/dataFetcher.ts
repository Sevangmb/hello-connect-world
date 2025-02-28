
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppModule, ModuleDependency } from "./types";
import { 
  fetchModules as fetchModulesApi, 
  fetchDependencies as fetchDependenciesApi,
  fetchFeatureFlags as fetchFeatureFlagsApi
} from "./api";
import { 
  combineModulesWithFeatures,
  cacheModuleStatuses
} from "./utils";

/**
 * Hook pour récupérer les données des modules et dépendances
 */
export const useModuleDataFetcher = () => {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [dependencies, setDependencies] = useState<ModuleDependency[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  /**
   * Récupérer tous les modules et leurs fonctionnalités
   */
  const fetchModules = async () => {
    try {
      setLoading(true);
      const modulesData = await fetchModulesApi();
      
      // Récupérer les feature flags pour chaque module
      const moduleFeatures = await fetchFeatureFlagsApi();
      
      // Combiner les modules avec leurs feature flags
      const modulesWithFeatures = combineModulesWithFeatures(modulesData, moduleFeatures);
      
      setModules(modulesWithFeatures);
      setFeatures(moduleFeatures);
      setInitialized(true);
      
      // Mettre en cache les statuts des modules
      cacheModuleStatuses(modulesWithFeatures);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des modules:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les modules de l'application",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer toutes les dépendances entre modules
   */
  const fetchDependencies = async () => {
    try {
      setLoading(true);
      const dependenciesData = await fetchDependenciesApi();
      setDependencies(dependenciesData);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des dépendances:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les dépendances entre modules",
      });
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
    initialized,
    fetchModules,
    fetchDependencies
  };
};
