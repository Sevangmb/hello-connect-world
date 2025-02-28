
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Vérifier la connexion à Supabase au démarrage
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Faire une simple requête pour vérifier la connexion
        const { data, error } = await supabase
          .from('app_modules')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error("Erreur de connexion à Supabase:", error);
          setConnectionStatus('disconnected');
          setError("Problème de connexion à la base de données");
        } else {
          console.log("Connexion à Supabase établie avec succès");
          setConnectionStatus('connected');
        }
      } catch (err) {
        console.error("Exception lors de la vérification de la connexion:", err);
        setConnectionStatus('disconnected');
        setError("Problème de connexion à la base de données");
      }
    };
    
    checkConnection();
  }, []);

  // Essayer de charger depuis le cache au démarrage
  useEffect(() => {
    const loadFromCache = () => {
      const cachedModules = getFullModulesFromCache();
      if (cachedModules && cachedModules.length > 0) {
        console.log("Modules chargés depuis le cache:", cachedModules.length);
        setModules(cachedModules);
        // Set loading to false if we have cached modules
        setTimeout(() => setLoading(false), 500);
      }
    };
    
    loadFromCache();
    
    // Set a timeout to stop loading state after 5 seconds regardless
    const timer = setTimeout(() => {
      if (loading) {
        console.log("Forcing loading state to end after timeout");
        setLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loading]);

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
              setLoading(false);
              return combinedModules;
            } else {
              setModules(directData);
              setLoading(false);
              return directData;
            }
          } else if (directError) {
            console.error("Erreur lors du chargement direct:", directError);
            setError(directError.message || "Échec du chargement des modules");
            setConnectionStatus('disconnected');
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
        setLoading(false);
        return combinedModules;
      } else {
        setModules(modulesData);
        setLoading(false);
        return modulesData;
      }
    } catch (err: any) {
      console.error("Error fetching modules:", err);
      setError(err.message || "Failed to fetch modules");
      
      // En cas d'erreur, retourner les modules du cache ou un tableau vide
      const result = modules.length > 0 ? modules : [];
      setLoading(false);
      return result;
    } finally {
      // Make sure loading is set to false regardless
      setTimeout(() => setLoading(false), 1000);
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
    fetchFeatures,
    connectionStatus
  };
};
