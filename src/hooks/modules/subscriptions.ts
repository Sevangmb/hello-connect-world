
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleDependency, RawModuleDependency } from "./types";

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
    .subscribe((status) => {
      console.log('Module subscription status:', status);
    });
    
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
    .subscribe((status) => {
      console.log('Feature subscription status:', status);
    });

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
    .subscribe((status) => {
      console.log('Dependency subscription status:', status);
    });

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
  // Requête simplifiée pour éviter les problèmes de parsing
  const { data, error } = await supabase
    .from('module_dependencies')
    .select(`
      id,
      module_id,
      dependency_id,
      is_required
    `);

  if (error) {
    console.error('Error fetching dependencies:', error);
    throw error;
  }
  
  // Récupérer tous les modules pour avoir les infos (code, name, status)
  const { data: modules, error: modulesError } = await supabase
    .from('app_modules')
    .select('id, code, name, status');
    
  if (modulesError) {
    console.error('Error fetching modules for dependencies:', modulesError);
    throw modulesError;
  }
  
  // Créer un mapping des modules par ID pour faciliter l'accès
  const moduleMap = new Map();
  modules.forEach(module => {
    moduleMap.set(module.id, module);
  });

  // Transformer les données pour correspondre à l'interface ModuleDependency
  const dependencies = data.map(dep => {
    const moduleInfo = moduleMap.get(dep.module_id);
    const dependencyInfo = moduleMap.get(dep.dependency_id);
    
    return {
      id: dep.id,
      module_id: dep.module_id,
      module_code: moduleInfo?.code,
      module_name: moduleInfo?.name,
      module_status: moduleInfo?.status,
      dependency_id: dep.dependency_id,
      dependency_code: dependencyInfo?.code,
      dependency_name: dependencyInfo?.name,
      dependency_status: dependencyInfo?.status,
      is_required: dep.is_required
    } as ModuleDependency;
  });

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

// Fonction d'aide pour rafraîchir manuellement les abonnements
export const refreshModuleSubscriptions = async () => {
  try {
    // Forcer la reconnexion aux canaux Supabase
    await supabase.removeAllChannels();
    console.log('Tous les canaux Supabase ont été supprimés');
    
    // Un court délai pour permettre à Supabase de nettoyer les connexions
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des abonnements:', error);
    return false;
  }
};
