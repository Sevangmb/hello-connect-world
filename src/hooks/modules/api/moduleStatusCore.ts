
import { supabase } from '@/integrations/supabase/client';
import { AppModule, ModuleStatus } from '../types';

/**
 * Cache for module status to avoid frequent DB queries
 */
interface ModuleCache {
  [key: string]: {
    status: ModuleStatus;
    timestamp: number;
  };
}

const moduleCache: ModuleCache = {};
const CACHE_TTL = 60 * 1000; // 1 minute cache TTL

/**
 * Get module status from cache or calculate it
 */
export const getModuleStatusFromCache = (moduleCode: string): ModuleStatus | null => {
  const cachedModule = moduleCache[moduleCode];
  
  if (cachedModule && Date.now() - cachedModule.timestamp < CACHE_TTL) {
    return cachedModule.status;
  }
  
  return null;
};

/**
 * Update the module cache
 */
export const updateModuleCache = (moduleCode: string, status: ModuleStatus): void => {
  moduleCache[moduleCode] = {
    status,
    timestamp: Date.now()
  };
};

/**
 * Get module cache data
 */
export const getModuleCache = (): ModuleCache => {
  return { ...moduleCache };
};

/**
 * Check if a module is active (synchronous)
 */
export const isModuleActive = (moduleCode: string): boolean => {
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  return cachedStatus === 'active';
};

/**
 * Check if a module is in degraded state (synchronous)
 */
export const isModuleDegraded = (moduleCode: string): boolean => {
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  return cachedStatus === 'degraded';
};

/**
 * Check if a module is in maintenance (synchronous)
 */
export const isModuleMaintenance = (moduleCode: string): boolean => {
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  return cachedStatus === 'maintenance';
};

/**
 * Check if a module is inactive (synchronous)
 */
export const isModuleInactive = (moduleCode: string): boolean => {
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  return cachedStatus === 'inactive';
};

/**
 * Get modules from database
 */
export const getModulesFromDb = async (): Promise<AppModule[]> => {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('*');

    if (error) {
      console.error('Error fetching modules:', error);
      return [];
    }

    // Update cache with fresh data
    data.forEach(module => {
      updateModuleCache(module.code, module.status);
    });

    return data as AppModule[];
  } catch (error) {
    console.error('Error in getModulesFromDb:', error);
    return [];
  }
};
