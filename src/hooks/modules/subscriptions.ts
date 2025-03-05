
/**
 * Gestion des abonnements aux données de modules via Supabase Realtime
 * Ce fichier centralise les fonctions de récupération de données et d'abonnement aux changements
 */

import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleDependency } from "./types";

// Constante pour identifier le module Admin
const ADMIN_MODULE_CODE = "admin";

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

  // S'assurer que le module Admin est toujours actif
  if (data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].code === ADMIN_MODULE_CODE && data[i].status !== 'active') {
        console.warn("Module Admin trouvé inactif, réparation automatique...");
        data[i].status = 'active';
        
        // Mettre à jour en base de données
        await supabase
          .from('app_modules')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('id', data[i].id);
      }
    }
  }

  // Transformer les données pour assurer qu'elles contiennent tous les champs requis par AppModule
  return (data || []).map(item => ({
    id: item.id,
    code: item.code,
    name: item.name,
    description: item.description || "",
    version: item.version || "1.0.0",
    status: item.status as any,
    is_core: item.is_core || false,
    is_admin: item.is_admin || item.code === ADMIN_MODULE_CODE || false,
    priority: item.priority || 0,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
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
    depends_on: item.dependency_code || "", // depends_on is required
    is_required: item.is_required,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString()
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
    // S'assurer que les fonctionnalités Admin sont toujours activées
    if (feature.module_code === ADMIN_MODULE_CODE && !feature.is_enabled) {
      console.warn("Fonctionnalité Admin trouvée inactive, réparation automatique...");
      feature.is_enabled = true;
      
      // Mettre à jour en base de données
      supabase
        .from('module_features')
        .update({ is_enabled: true, updated_at: new Date().toISOString() })
        .eq('id', feature.id);
    }
    
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
      
      // Vérifier si c'est le module Admin qui est modifié
      if (payload.new && typeof payload.new === 'object' && 'code' in payload.new && 
          'status' in payload.new && payload.new.code === ADMIN_MODULE_CODE && 
          payload.new.status !== 'active') {
        console.warn("Tentative de désactivation du module Admin via Realtime, blocage...");
        // On laisse passer la notification mais la logique dans useModules va forcer sa réactivation
      }
      
      options.onModuleChange(payload);
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'module_features'
    }, (payload) => {
      console.log('Feature change detected:', payload);
      
      // Vérifier si c'est une fonctionnalité du module Admin
      if (payload.new && typeof payload.new === 'object' && 'module_code' in payload.new && 
          'is_enabled' in payload.new && payload.new.module_code === ADMIN_MODULE_CODE && 
          !payload.new.is_enabled) {
        console.warn("Tentative de désactivation d'une fonctionnalité Admin via Realtime, blocage...");
        // On laisse passer la notification mais la logique dans useModules va forcer sa réactivation
      }
      
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
