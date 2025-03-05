
import { supabase } from '@/integrations/supabase/client';
import { ModuleStatus } from '../types';
import { getModuleStatusFromCache, updateModuleCache } from './moduleStatusCore';

/**
 * Check if a module is active (asynchronous)
 */
export const checkModuleActiveAsync = async (moduleCode: string): Promise<boolean> => {
  // First try from cache
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  if (cachedStatus !== null) {
    return cachedStatus === 'active';
  }

  // If not in cache, fetch from DB
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();

    if (error) {
      console.error(`Error checking module ${moduleCode} status:`, error);
      return false;
    }

    const status = data.status as ModuleStatus;
    updateModuleCache(moduleCode, status);
    return status === 'active';
  } catch (error) {
    console.error(`Error in checkModuleActiveAsync for ${moduleCode}:`, error);
    return false;
  }
};

/**
 * Check if a module is in degraded state (asynchronous)
 */
export const checkModuleDegradedAsync = async (moduleCode: string): Promise<boolean> => {
  // First try from cache
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  if (cachedStatus !== null) {
    return cachedStatus === 'degraded';
  }

  // If not in cache, fetch from DB
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();

    if (error) {
      console.error(`Error checking module ${moduleCode} status:`, error);
      return false;
    }

    const status = data.status as ModuleStatus;
    updateModuleCache(moduleCode, status);
    return status === 'degraded';
  } catch (error) {
    console.error(`Error in checkModuleDegradedAsync for ${moduleCode}:`, error);
    return false;
  }
};

/**
 * Check if a feature is enabled (asynchronous)
 */
export const checkFeatureEnabledAsync = async (
  moduleCode: string, 
  featureCode: string,
  isModuleActiveFunc?: (moduleCode: string) => Promise<boolean>
): Promise<boolean> => {
  try {
    // Check if module is active first if provided
    if (isModuleActiveFunc) {
      const isActive = await isModuleActiveFunc(moduleCode);
      if (!isActive) {
        return false;
      }
    }

    const { data, error } = await supabase
      .from('module_features')
      .select('is_enabled')
      .eq('module_code', moduleCode)
      .eq('feature_code', featureCode)
      .single();

    if (error) {
      console.error(`Error checking feature ${featureCode} status:`, error);
      return false;
    }

    return data.is_enabled;
  } catch (error) {
    console.error(`Error in checkFeatureEnabledAsync for ${moduleCode}/${featureCode}:`, error);
    return false;
  }
};
