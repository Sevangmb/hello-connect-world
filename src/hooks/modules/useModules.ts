
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppModule, ModuleDependency, ModuleStatus } from "./types";
import { 
  fetchModules as fetchModulesApi, 
  fetchDependencies as fetchDependenciesApi,
  fetchFeatureFlags as fetchFeatureFlagsApi,
  updateModuleStatus as updateModuleStatusApi,
  updateFeatureStatus as updateFeatureStatusApi
} from "./api";
import { 
  checkModuleActive, 
  checkModuleDegraded, 
  checkFeatureEnabled,
  combineModulesWithFeatures,
  cacheModuleStatuses,
  getModuleStatusesFromCache
} from "./utils";
import { supabase } from "@/integrations/supabase/client";

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

  // Récupérer toutes les dépendances
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

  // Vérifier si un module est actif
  const isModuleActive = (moduleCode: string): boolean => {
    return checkModuleActive(modules, moduleCode);
  };

  // Vérifier si un module est en mode dégradé
  const isModuleDegraded = (moduleCode: string): boolean => {
    return checkModuleDegraded(modules, moduleCode);
  };

  // Vérifier si une fonctionnalité spécifique d'un module est activée
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    return checkFeatureEnabled(modules, features, moduleCode, featureCode);
  };

  // Mettre à jour l'état d'un module (pour les admins)
  const updateModuleStatus = async (moduleId: string, status: ModuleStatus) => {
    try {
      await updateModuleStatusApi(moduleId, status);

      // Mettre à jour le statut local pour une réponse plus rapide de l'UI
      setModules(prevModules => {
        const updatedModules = prevModules.map(module => 
          module.id === moduleId ? { ...module, status } : module
        );
        
        // Mettre à jour le cache
        cacheModuleStatuses(updatedModules);
        
        return updatedModules;
      });

      toast({
        title: "Module mis à jour",
        description: "Le statut du module a été modifié avec succès",
      });

      // Rafraîchir les données
      // Note: On peut garder ces appels pour être sûr que tout est synchronisé
      // mais l'UI sera déjà mise à jour grâce au setModules ci-dessus
      fetchModules();
      fetchDependencies();
      
      // Déclencher une mise à jour immédiate pour tous les composants qui utilisent ModuleGuard
      window.dispatchEvent(new CustomEvent('module_status_changed'));
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
      await updateFeatureStatusApi(moduleCode, featureCode, isEnabled);

      // Mettre à jour le statut local pour une réponse plus rapide
      setFeatures(prevFeatures => {
        const updatedFeatures = { ...prevFeatures };
        
        if (!updatedFeatures[moduleCode]) {
          updatedFeatures[moduleCode] = {};
        }
        
        updatedFeatures[moduleCode][featureCode] = isEnabled;
        
        return updatedFeatures;
      });

      toast({
        title: "Fonctionnalité mise à jour",
        description: `La fonctionnalité "${featureCode}" a été ${isEnabled ? 'activée' : 'désactivée'} avec succès`,
      });

      // Rafraîchir les feature flags
      const updatedFeatures = await fetchFeatureFlagsApi();
      setFeatures(updatedFeatures);
      
      // Mettre à jour les modules avec les nouvelles valeurs de feature flags
      setModules(prevModules => 
        combineModulesWithFeatures(prevModules, updatedFeatures)
      );
      
      // Déclencher une mise à jour immédiate pour tous les composants qui utilisent FeatureGuard
      window.dispatchEvent(new CustomEvent('feature_status_changed'));
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la fonctionnalité:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la fonctionnalité",
      });
    }
  };

  // S'abonner aux changements de modules via l'API temps réel de Supabase
  useEffect(() => {
    const moduleChannel = supabase
      .channel('app_modules_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'app_modules' 
      }, () => {
        // Rafraîchir les modules quand il y a un changement
        fetchModules();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(moduleChannel);
    };
  }, []);

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
