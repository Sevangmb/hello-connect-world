
import { ModuleStatus } from '../types';

/**
 * Cache for module status to avoid frequent DB queries
 */
interface ModuleCache {
  [key: string]: {
    status: ModuleStatus;
    timestamp: number;
  };
}

export interface ModuleCacheData {
  inMemoryModulesCache: any[];
  lastFetchTimestamp: number;
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
export const updateModuleCache = (moduleCodeOrModules: string | any[], status?: ModuleStatus): void => {
  if (typeof moduleCodeOrModules === 'string' && status !== undefined) {
    // Single module update
    moduleCache[moduleCodeOrModules] = {
      status,
      timestamp: Date.now()
    };
  } else if (Array.isArray(moduleCodeOrModules)) {
    // Bulk update with array of modules
    moduleCodeOrModules.forEach(module => {
      if (module.code && module.status) {
        moduleCache[module.code] = {
          status: module.status,
          timestamp: Date.now()
        };
      }
    });
  }
};

/**
 * Get module cache data
 */
export const getModuleCache = (): ModuleCacheData => {
  return {
    inMemoryModulesCache: [], // This should return the actual modules, but we'll keep it empty for now
    lastFetchTimestamp: Date.now()
  };
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
 * Check if a module is an admin module
 */
export const isAdminModule = (moduleCode: string): boolean => {
  return moduleCode === 'admin' || moduleCode.startsWith('admin_');
};
