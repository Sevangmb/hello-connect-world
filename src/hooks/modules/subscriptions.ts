
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleDependency } from "./types";

interface SubscriptionCallbacks {
  onModuleChange: (payload?: any) => void;
  onFeatureChange: (payload?: any) => void;
  onDependencyChange: (payload?: any) => void;
}

/**
 * Créer des abonnements temps réel aux tables de modules et fonctionnalités
 */
export const createModuleSubscriptions = (callbacks: SubscriptionCallbacks) => {
  const { onModuleChange, onFeatureChange, onDependencyChange } = callbacks;
  
  // 1. Créer un canal pour les changements de modules
  const moduleChannel = supabase
    .channel('app_modules_changes')
    .on('postgres_changes', { 
      event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
      schema: 'public', 
      table: 'app_modules' 
    }, (payload) => {
      console.log('Module change detected:', payload);
      onModuleChange(payload);
    })
    .subscribe();
    
  // 2. Créer un canal pour les changements de fonctionnalités
  const featureChannel = supabase
    .channel('module_features_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'module_features' 
    }, (payload) => {
      console.log('Feature change detected:', payload);
      onFeatureChange(payload);
    })
    .subscribe();

  // 3. Créer un canal pour les changements de dépendances
  const dependencyChannel = supabase
    .channel('module_dependencies_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'module_dependencies' 
    }, (payload) => {
      console.log('Dependency change detected:', payload);
      onDependencyChange(payload);
    })
    .subscribe();

  // Fonction pour nettoyer les abonnements
  const cleanup = () => {
    supabase.removeChannel(moduleChannel);
    supabase.removeChannel(featureChannel);
    supabase.removeChannel(dependencyChannel);
  };

  return { 
    cleanup, 
    channels: [moduleChannel, featureChannel, dependencyChannel] 
  };
};

/**
 * Fetch tous les modules depuis Supabase
 */
export const fetchModulesRealtime = async (): Promise<AppModule[]> => {
  const { data, error } = await supabase
    .from('app_modules')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch toutes les dépendances des modules depuis Supabase
 */
export const fetchDependenciesRealtime = async (): Promise<ModuleDependency[]> => {
  const { data, error } = await supabase
    .from('module_dependencies')
    .select(`
      id,
      module_id,
      dependency_id,
      is_required,
      modules:app_modules!module_dependencies_module_id_fkey (
        code as module_code,
        name as module_name,
        status as module_status
      ),
      dependencies:app_modules!module_dependencies_dependency_id_fkey (
        code as dependency_code,
        name as dependency_name,
        status as dependency_status
      )
    `);

  if (error) {
    console.error('Error fetching dependencies:', error);
    throw error;
  }

  // Transformer les données pour correspondre à l'interface ModuleDependency
  const dependencies = data.map((dep) => ({
    id: dep.id,
    module_id: dep.module_id,
    module_code: dep.modules?.module_code,
    module_name: dep.modules?.module_name,
    module_status: dep.modules?.module_status,
    dependency_id: dep.dependency_id,
    dependency_code: dep.dependencies?.dependency_code,
    dependency_name: dep.dependencies?.dependency_name,
    dependency_status: dep.dependencies?.dependency_status,
    is_required: dep.is_required
  })) as ModuleDependency[];

  return dependencies;
};

/**
 * Fetch tous les feature flags depuis Supabase
 */
export const fetchFeatureFlagsRealtime = async () => {
  const { data, error } = await supabase
    .from('module_features')
    .select('*');

  if (error) {
    console.error('Error fetching feature flags:', error);
    throw error;
  }

  // Transformer en Map pour un accès plus facile
  const featuresMap: Record<string, Record<string, boolean>> = {};
  
  data.forEach((feature) => {
    if (!featuresMap[feature.module_code]) {
      featuresMap[feature.module_code] = {};
    }
    featuresMap[feature.module_code][feature.feature_code] = feature.is_enabled;
  });

  return featuresMap;
};
