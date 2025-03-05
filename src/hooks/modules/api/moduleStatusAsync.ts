
import { ModuleStatus } from "../types";
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a module is active by querying the database
 */
export async function checkModuleActiveAsync(moduleCode: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching status for module ${moduleCode}:`, error);
      return false;
    }
    
    return data.status === 'active';
  } catch (e) {
    console.error(`Exception when checking if module ${moduleCode} is active:`, e);
    return false;
  }
}

/**
 * Check if a module is in degraded mode by querying the database
 */
export async function checkModuleDegradedAsync(moduleCode: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching status for module ${moduleCode}:`, error);
      return false;
    }
    
    return data.status === 'degraded';
  } catch (e) {
    console.error(`Exception when checking if module ${moduleCode} is degraded:`, e);
    return false;
  }
}

/**
 * Check if a feature is enabled by querying the database
 */
export async function checkFeatureEnabledAsync(
  moduleCode: string, 
  featureCode: string,
  isModuleActive: (moduleCode: string) => Promise<boolean>
): Promise<boolean> {
  try {
    // First, check if the module is active
    const moduleIsActive = await isModuleActive(moduleCode);
    if (!moduleIsActive) {
      return false;
    }

    const { data, error } = await supabase
      .from('module_features')
      .select('is_enabled')
      .eq('module_code', moduleCode)
      .eq('feature_code', featureCode)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching feature ${featureCode} for module ${moduleCode}:`, error);
      return false;
    }
    
    return data.is_enabled;
  } catch (e) {
    console.error(`Exception when checking if feature ${featureCode} is enabled for module ${moduleCode}:`, e);
    return false;
  }
}

/**
 * Get a module's status by querying the database
 */
export async function getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching status for module ${moduleCode}:`, error);
      return null;
    }
    
    return data.status as ModuleStatus;
  } catch (e) {
    console.error(`Exception when fetching module status for ${moduleCode}:`, e);
    return null;
  }
}
