
import { useState, useEffect, useCallback } from "react";
import { AppModule, ModuleFeature, ModuleDependency, ModuleStatus } from "./types";
import { fetchModules, fetchDependencies, fetchFeatures } from "./fetcher";
import { useConnectionChecker } from "./fetcher/connectionChecker";
import { ADMIN_MODULE_CODE } from "./constants";

/**
 * Hook de base pour la gestion des modules
 * Ce hook expose les fonctionnalités fondamentales
 */
export const useModuleCore = () => {
  // États pour stocker les données des modules
  const [modules, setModules] = useState<AppModule[]>([]);
  const [dependencies, setDependencies] = useState<ModuleDependency[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Vérifier l'état de la connexion à Supabase
  const { connectionStatus } = useConnectionChecker();
  
  // Récupérer les modules
  const fetchModulesData = useCallback(async (force: boolean = false) => {
    setLoading(true);
    try {
      const moduleData = await fetchModules(force);
      setModules(moduleData);
      return moduleData;
    } catch (err: any) {
      console.error("Erreur lors du chargement des modules:", err);
      setError(err.message || "Erreur lors du chargement des modules");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Récupérer les dépendances des modules
  const fetchDependenciesData = useCallback(async () => {
    try {
      const dependencyData = await fetchDependencies();
      setDependencies(dependencyData);
      return dependencyData;
    } catch (err: any) {
      console.error("Erreur lors du chargement des dépendances:", err);
      return [];
    }
  }, []);
  
  // Récupérer les fonctionnalités des modules
  const fetchFeaturesData = useCallback(async () => {
    try {
      const featureData = await fetchFeatures();
      setFeatures(featureData);
      return featureData;
    } catch (err: any) {
      console.error("Erreur lors du chargement des fonctionnalités:", err);
      return {};
    }
  }, []);
  
  // Charger les données au démarrage
  useEffect(() => {
    if (connectionStatus === 'connected') {
      const loadData = async () => {
        await Promise.all([
          fetchModulesData(),
          fetchDependenciesData(),
          fetchFeaturesData()
        ]);
      };
      
      loadData();
    } else if (connectionStatus === 'disconnected') {
      setError("Impossible de se connecter à la base de données");
      setLoading(false);
    }
  }, [fetchModulesData, fetchDependenciesData, fetchFeaturesData, connectionStatus]);
  
  // Fonction pour vérifier si un module est actif
  const isModuleActive = useCallback((moduleCode: string): boolean => {
    // Si le moduleCode est admin, toujours retourner true
    if (moduleCode === ADMIN_MODULE_CODE) {
      return true;
    }
    
    const module = modules.find(m => m.code === moduleCode);
    return module ? module.status === 'active' : false;
  }, [modules]);
  
  // Fonction pour vérifier si un module est en état dégradé
  const isModuleDegraded = useCallback((moduleCode: string): boolean => {
    const module = modules.find(m => m.code === moduleCode);
    return module ? module.status === 'degraded' : false;
  }, [modules]);
  
  // Fonction pour vérifier si une fonctionnalité est activée
  const isFeatureEnabled = useCallback((moduleCode: string, featureCode: string): boolean => {
    // Si le module n'est pas actif, la fonctionnalité n'est pas disponible
    if (!isModuleActive(moduleCode) && moduleCode !== ADMIN_MODULE_CODE) {
      return false;
    }
    
    return features[moduleCode] ? !!features[moduleCode][featureCode] : false;
  }, [features, isModuleActive]);
  
  // Fonction pour mettre à jour un module
  const updateModule = useCallback(async (moduleId: string, status: ModuleStatus): Promise<boolean> => {
    try {
      // Simuler une mise à jour pour le moment
      console.log(`Mise à jour du module ${moduleId} avec le statut ${status}`);
      // En production, appeler une API ou utiliser Supabase ici
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du module:", err);
      return false;
    }
  }, []);
  
  // Fonction pour mettre à jour une fonctionnalité
  const updateFeature = useCallback(async (moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> => {
    try {
      // Simuler une mise à jour pour le moment
      console.log(`Mise à jour de la fonctionnalité ${featureCode} du module ${moduleCode} avec l'état ${isEnabled}`);
      // En production, appeler une API ou utiliser Supabase ici
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la fonctionnalité:", err);
      return false;
    }
  }, []);
  
  // Fonction pour mettre à jour une fonctionnalité silencieusement (sans notification)
  const updateFeatureSilent = useCallback(async (moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> => {
    try {
      console.log(`Mise à jour silencieuse de la fonctionnalité ${featureCode} du module ${moduleCode} avec l'état ${isEnabled}`);
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour silencieuse de la fonctionnalité:", err);
      return false;
    }
  }, []);
  
  return {
    // États
    modules,
    dependencies,
    features,
    loading,
    error,
    
    // Fonctions de vérification
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    
    // Fonctions de mise à jour
    updateModule,
    updateFeature,
    updateFeatureSilent,
    
    // Fonctions de récupération
    fetchModules: fetchModulesData,
    fetchDependencies: fetchDependenciesData,
    fetchFeatures: fetchFeaturesData,
    
    // Gestion des États
    setModules,
    setDependencies,
    setFeatures,
    
    // État de la connexion
    connectionStatus
  };
};
