
import { useState, useEffect, useCallback } from "react";
import { AppModule, ModuleFeature, ModuleDependency, ModuleStatus } from "./types";
import { useConnectionChecker } from "./fetcher/connectionChecker";
import { ADMIN_MODULE_CODE } from "./constants";
import { supabase } from "@/integrations/supabase/client";

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
      // Récupérer les modules depuis Supabase
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      const moduleData = data || [];
      setModules(moduleData as AppModule[]);
      return moduleData as AppModule[];
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
      // Vérifier si la table existe avant de faire la requête
      const { data, error } = await supabase
        .from('module_dependencies')
        .select('*');
        
      if (error) {
        console.error("Erreur lors de la récupération des dépendances:", error);
        return [];
      }
      
      // Mapper les données disponibles
      const dependencyData: ModuleDependency[] = (data || []).map(item => {
        // Utiliser les champs qui existent réellement dans la table
        return {
          module_id: item.module_id || "",
          module_code: item.module_id || "", // Utiliser module_id comme fallback
          module_name: "Module " + item.module_id, // Générer un nom par défaut
          module_status: 'active' as ModuleStatus, // Valeur par défaut
          dependency_id: item.dependency_id || "",
          dependency_code: item.dependency_id || "", // Utiliser dependency_id comme fallback
          dependency_name: "Module " + item.dependency_id, // Générer un nom par défaut
          dependency_status: 'active' as ModuleStatus, // Valeur par défaut
          is_required: !!item.is_required
        };
      });
      
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
      // Récupérer les fonctionnalités depuis Supabase
      const { data, error } = await supabase
        .from('module_features')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      // Convertir les données en un format utilisable
      const featureData = data?.reduce((acc, feature) => {
        if (!acc[feature.module_code]) {
          acc[feature.module_code] = {};
        }
        acc[feature.module_code][feature.feature_code] = feature.is_enabled;
        return acc;
      }, {} as Record<string, Record<string, boolean>>) || {};
      
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
      const { error } = await supabase
        .from('app_modules')
        .update({ status })
        .eq('id', moduleId);
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du module:", err);
      return false;
    }
  }, []);
  
  // Fonction pour mettre à jour une fonctionnalité
  const updateFeature = useCallback(async (moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ is_enabled: isEnabled })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la fonctionnalité:", err);
      return false;
    }
  }, []);
  
  // Fonction pour mettre à jour une fonctionnalité silencieusement (sans notification)
  const updateFeatureSilent = useCallback(async (moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ is_enabled: isEnabled })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);
        
      if (error) throw error;
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
