
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ModuleStatus = 'active' | 'inactive' | 'degraded';

export interface AppModule {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: ModuleStatus;
  is_core: boolean;
  created_at: string;
  updated_at: string;
  // Ajout des feature flags
  features?: Record<string, boolean>;
}

export interface ModuleDependency {
  module_id: string;
  module_code: string;
  module_name: string;
  module_status: ModuleStatus;
  dependency_id: string | null;
  dependency_code: string | null;
  dependency_name: string | null;
  dependency_status: ModuleStatus | null;
  is_required: boolean | null;
}

export const useModules = () => {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [dependencies, setDependencies] = useState<ModuleDependency[]>([]);
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);

  // Récupérer tous les modules
  const fetchModules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Récupérer les feature flags pour chaque module
      const moduleFeatures = await fetchFeatureFlags();
      
      // Combiner les modules avec leurs feature flags
      const modulesWithFeatures = data?.map(module => ({
        ...module,
        features: moduleFeatures[module.code] || {}
      })) || [];
      
      setModules(modulesWithFeatures);
      setFeatures(moduleFeatures);
      setInitialized(true);
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

  // Récupérer toutes les dépendances
  const fetchDependencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('module_dependencies_view')
        .select('*');

      if (error) throw error;
      setDependencies(data || []);
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

  // Récupérer les feature flags de tous les modules
  const fetchFeatureFlags = async (): Promise<Record<string, Record<string, boolean>>> => {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*');

      if (error) throw error;
      
      // Organiser les feature flags par module
      const featuresByModule: Record<string, Record<string, boolean>> = {};
      data?.forEach(feature => {
        if (!featuresByModule[feature.module_code]) {
          featuresByModule[feature.module_code] = {};
        }
        featuresByModule[feature.module_code][feature.feature_code] = feature.is_enabled;
      });
      
      return featuresByModule;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des feature flags:", error);
      // En cas d'erreur, retourner un objet vide plutôt que de bloquer le chargement
      return {};
    }
  };

  // Vérifier si un module est actif
  const isModuleActive = (moduleCode: string): boolean => {
    if (!initialized) return false;
    const module = modules.find(m => m.code === moduleCode);
    return module ? module.status === 'active' : false;
  };

  // Vérifier si un module est en mode dégradé
  const isModuleDegraded = (moduleCode: string): boolean => {
    if (!initialized) return false;
    const module = modules.find(m => m.code === moduleCode);
    return module ? module.status === 'degraded' : false;
  };

  // Vérifier si une fonctionnalité spécifique d'un module est activée
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    if (!initialized) return false;
    // Si le module n'est pas actif, la fonctionnalité ne l'est pas non plus
    if (!isModuleActive(moduleCode)) return false;
    
    // Vérifier si la fonctionnalité existe et est activée
    return features[moduleCode]?.[featureCode] === true;
  };

  // Mettre à jour l'état d'un module (pour les admins)
  const updateModuleStatus = async (moduleId: string, status: ModuleStatus) => {
    try {
      const { error } = await supabase
        .from('app_modules')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', moduleId);

      if (error) throw error;

      toast({
        title: "Module mis à jour",
        description: "Le statut du module a été modifié avec succès",
      });

      // Rafraîchir les données
      fetchModules();
      fetchDependencies();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du module:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du module",
      });
    }
  };

  // Mettre à jour l'état d'une fonctionnalité spécifique (pour les admins)
  const updateFeatureStatus = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
        .match({ module_code: moduleCode, feature_code: featureCode });

      if (error) throw error;

      toast({
        title: "Fonctionnalité mise à jour",
        description: `La fonctionnalité "${featureCode}" a été ${isEnabled ? 'activée' : 'désactivée'} avec succès`,
      });

      // Rafraîchir les feature flags
      const updatedFeatures = await fetchFeatureFlags();
      setFeatures(updatedFeatures);
      
      // Mettre à jour les modules avec les nouvelles valeurs de feature flags
      setModules(prevModules => 
        prevModules.map(module => ({
          ...module,
          features: updatedFeatures[module.code] || {}
        }))
      );
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la fonctionnalité:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la fonctionnalité",
      });
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    Promise.all([fetchModules(), fetchDependencies()]);
  }, []);

  return {
    modules,
    dependencies,
    loading,
    error,
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled,
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules: fetchModules,
    refreshDependencies: fetchDependencies,
  };
};
