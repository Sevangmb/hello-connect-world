import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "./types";

// Récupérer tous les modules
export const fetchModules = async () => {
  const { data, error } = await supabase
    .from('app_modules')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

// Récupérer les feature flags pour tous les modules
export const fetchFeatureFlags = async () => {
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
};

// Récupérer toutes les dépendances
export const fetchDependencies = async () => {
  const { data, error } = await supabase
    .from('module_dependencies_view')
    .select('*');

  if (error) throw error;
  return data || [];
};

// Mettre à jour l'état d'un module
export const updateModuleStatus = async (moduleId: string, status: ModuleStatus) => {
  const { error } = await supabase
    .from('app_modules')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', moduleId);

  if (error) throw error;
};

// Mettre à jour l'état d'une fonctionnalité spécifique
export const updateFeatureStatus = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
  const { error } = await supabase
    .from('module_features')
    .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
    .match({ module_code: moduleCode, feature_code: featureCode });

  if (error) throw error;
};

import { 
  checkModuleActiveAsync, 
  checkModuleDegradedAsync, 
  checkFeatureEnabledAsync 
} from './api/moduleStatusAsync';

import { 
  updateModuleStatusInDb, 
  updateFeatureStatusInDb 
} from './api/moduleStatusUpdates';

import {
  getModuleCache,
  updateModuleCache,
  isAdminModule
} from './api/moduleStatusCore';
