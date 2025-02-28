
/**
 * Gestion des abonnements aux données de modules via Supabase Realtime
 * Ce fichier centralise les fonctions de récupération de données et d'abonnement aux changements
 */

import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleDependency } from "./types";

// Interface pour les options d'abonnement
interface SubscriptionOptions {
  onModuleChange: (payload: any) => void;
  onFeatureChange: (payload: any) => void;
  onDependencyChange: (payload: any) => void;
}

/**
 * Récupérer tous les modules en temps réel
 */
export const fetchModulesRealtime = async (): Promise<AppModule[]> => {
  const { data, error } = await supabase
    .from('app_modules')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching modules:", error);
    throw error;
  }

  return data || [];
};

/**
 * Récupérer toutes les dépendances en temps réel
 */
export const fetchDependenciesRealtime = async (): Promise<ModuleDependency[]> => {
  const { data, error } = await supabase
    .from('module_dependencies_view')
    .select('*');

  if (error) {
    console.error("Error fetching dependencies:", error);
    throw error;
  }

  // Map the returned data to match the ModuleDependency interface
  // Adding the id property using the module_id as a base 
  return (data || []).map(item => ({
    id: item.module_id + '_' + item.dependency_id, // Creating a synthetic id from module_id and dependency_id
    module_id: item.module_id,
    module_code: item.module_code,
    module_name: item.module_name,
    module_status: item.module_status,
    dependency_id: item.dependency_id,
    dependency_code: item.dependency_code,
    dependency_name: item.dependency_name,
    dependency_status: item.dependency_status,
    is_required: item.is_required
  }));
};

/**
 * Récupérer tous les feature flags en temps réel
 */
export const fetchFeatureFlagsRealtime = async (): Promise<Record<string, Record<string, boolean>>> => {
  const { data, error } = await supabase
    .from('module_features')
    .select('*');

  if (error) {
    console.error("Error fetching features:", error);
    throw error;
  }

  // Organiser les features par module
  const featuresByModule: Record<string, Record<string, boolean>> = {};
  
  (data || []).forEach(feature => {
    if (!featuresByModule[feature.module_code]) {
      featuresByModule[feature.module_code] = {};
    }
    featuresByModule[feature.module_code][feature.feature_code] = feature.is_enabled;
  });

  return featuresByModule;
};

/**
 * Créer des abonnements Supabase Realtime pour les tables de modules
 */
export const createModuleSubscriptions = (options: SubscriptionOptions) => {
  // Créer un canal pour toutes les tables liées aux modules
  const channel = supabase
    .channel('module-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'app_modules'
    }, (payload) => {
      console.log('Module change detected:', payload);
      options.onModuleChange(payload);
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'module_features'
    }, (payload) => {
      console.log('Feature change detected:', payload);
      options.onFeatureChange(payload);
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'module_dependencies'
    }, (payload) => {
      console.log('Dependency change detected:', payload);
      options.onDependencyChange(payload);
    })
    .subscribe((status) => {
      console.log('Realtime subscription status:', status);
    });

  // Retourner une fonction de nettoyage
  return {
    cleanup: () => {
      console.log('Cleaning up Supabase module subscriptions');
      supabase.removeChannel(channel);
    }
  };
};
