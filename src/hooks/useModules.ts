
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Récupérer tous les modules
  const fetchModules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');

      if (error) throw error;
      setModules(data || []);
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

  // Vérifier si un module est actif
  const isModuleActive = (moduleCode: string): boolean => {
    const module = modules.find(m => m.code === moduleCode);
    return module ? module.status === 'active' : false;
  };

  // Vérifier si un module est en mode dégradé
  const isModuleDegraded = (moduleCode: string): boolean => {
    const module = modules.find(m => m.code === moduleCode);
    return module ? module.status === 'degraded' : false;
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
    updateModuleStatus,
    refreshModules: fetchModules,
    refreshDependencies: fetchDependencies,
  };
};
