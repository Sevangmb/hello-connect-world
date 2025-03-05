import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleDependency, ModuleStatus } from "./types";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_EVENTS } from "@/services/modules/ModuleEvents";

/**
 * Gère les abonnements aux changements de modules via Supabase Realtime
 */
export const setupModuleSubscriptions = (
  onModulesUpdate: (modules: AppModule[]) => void,
  onDependenciesUpdate: (dependencies: ModuleDependency[]) => void,
  onFeaturesUpdate: (features: Record<string, Record<string, boolean>>) => void
) => {
  // Supprimer les canaux existants pour éviter les duplications
  const existingChannels = supabase.getChannels();
  existingChannels.forEach(ch => {
    if (ch.topic.includes('module-changes')) {
      supabase.removeChannel(ch);
    }
  });

  // Créer un nouveau canal pour les modules
  const channel = supabase.channel('module-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'app_modules'
    }, async (payload) => {
      console.log('Module change detected:', payload);
      
      // Récupérer tous les modules mis à jour
      try {
        const { data, error } = await supabase
          .from('app_modules')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        // Traiter les données pour s'assurer que tous les champs requis sont présents
        const processedModules = data.map(module => {
          // Vérifier que le statut est valide
          let status = module.status as ModuleStatus;
          if (status !== 'active' && status !== 'inactive' && status !== 'degraded' && status !== 'maintenance') {
            status = 'inactive';
          }
          
          // Ajouter les champs manquants avec des valeurs par défaut
          return {
            ...module,
            status,
            version: module.version || "1.0.0",
            is_admin: module.is_admin || false,
            priority: module.priority || 0
          } as AppModule;
        });
        
        // Mettre à jour l'état
        onModulesUpdate(processedModules);
        
        // Publier un événement
        eventBus.publish(MODULE_EVENTS.MODULES_UPDATED, {
          count: processedModules.length,
          timestamp: Date.now()
        });
      } catch (err) {
        console.error('Error refreshing modules after change:', err);
      }
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'module_dependencies'
    }, async () => {
      // Récupérer toutes les dépendances mises à jour
      try {
        const { data, error } = await supabase
          .from('module_dependencies_view')
          .select('*');
          
        if (error) throw error;
        
        // Traiter les données pour s'assurer que tous les champs requis sont présents
        const processedDependencies = data.map(dep => ({
          id: dep.module_id + '_' + dep.dependency_id,
          module_id: dep.module_id,
          module_code: dep.module_code,
          module_name: dep.module_name,
          module_status: dep.module_status,
          dependency_id: dep.dependency_id,
          dependency_code: dep.dependency_code,
          dependency_name: dep.dependency_name,
          dependency_status: dep.dependency_status,
          depends_on: dep.dependency_code || "",
          is_required: dep.is_required,
          created_at: dep.created_at || new Date().toISOString(),
          updated_at: dep.updated_at || new Date().toISOString()
        }));
        
        // Mettre à jour l'état
        onDependenciesUpdate(processedDependencies);
      } catch (err) {
        console.error('Error refreshing dependencies after change:', err);
      }
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'module_features'
    }, async () => {
      // Récupérer toutes les fonctionnalités mises à jour
      try {
        const { data, error } = await supabase
          .from('module_features')
          .select('*');
          
        if (error) throw error;
        
        // Organiser les fonctionnalités par module
        const featuresData: Record<string, Record<string, boolean>> = {};
        data.forEach(feature => {
          if (!featuresData[feature.module_code]) {
            featuresData[feature.module_code] = {};
          }
          featuresData[feature.module_code][feature.feature_code] = feature.is_enabled;
        });
        
        // Mettre à jour l'état
        onFeaturesUpdate(featuresData);
      } catch (err) {
        console.error('Error refreshing features after change:', err);
      }
    })
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log('Subscribed to module changes');
      } else if (err) {
        console.error('Error subscribing to module changes:', err);
      }
    });

  // Retourner une fonction pour se désabonner
  return () => {
    supabase.removeChannel(channel);
  };
};

// Fonctions utilitaires pour traiter les données de modules
export const processModuleData = (moduleData: any) => {
  return {
    ...moduleData,
    version: moduleData.version || "1.0.0",
    is_admin: moduleData.is_admin || false,
    priority: moduleData.priority || 0
  };
};

export const processDependencyData = (dependencyData: any) => {
  return {
    ...dependencyData,
    depends_on: dependencyData.dependency_code || "",
    created_at: dependencyData.created_at || new Date().toISOString(),
    updated_at: dependencyData.updated_at || new Date().toISOString()
  };
};
