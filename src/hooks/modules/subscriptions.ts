
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

  return data || [];
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
