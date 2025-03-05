
import { ModuleStatus } from '../types';

// Module status cache to minimize API calls
const moduleCache = new Map<string, ModuleStatus>();
const adminModules = new Set<string>();

// Extended module cache structure
interface ModuleCache {
  inMemoryModulesCache: any[];
  lastFetchTimestamp: number;
}

// Global cache object
const globalModuleCache: ModuleCache = {
  inMemoryModulesCache: [],
  lastFetchTimestamp: 0
};

export const isActiveStatus = (status: ModuleStatus): boolean => {
  return status === 'active';
};

export const isDegradedStatus = (status: ModuleStatus): boolean => {
  return status === 'degraded';
};

export const isInactiveStatus = (status: ModuleStatus): boolean => {
  return status === 'inactive';
};

export const isMaintenanceStatus = (status: ModuleStatus): boolean => {
  return status === 'maintenance';
};

export const getEffectiveStatus = (status: ModuleStatus, hasMissingDependencies: boolean): ModuleStatus => {
  if (status === 'active' && hasMissingDependencies) {
    return 'degraded';
  }
  return status;
};

// Additional functions needed by other modules:
export const getModuleStatusFromCache = (moduleCode: string): ModuleStatus | null => {
  return moduleCache.get(moduleCode) || null;
};

export const getModuleCache = (): any => {
  return globalModuleCache;
};

export const updateModuleCache = (modules: any[]): void => {
  globalModuleCache.inMemoryModulesCache = modules;
  globalModuleCache.lastFetchTimestamp = Date.now();
};

export const isModuleActive = (moduleCode: string): boolean => {
  const status = moduleCache.get(moduleCode);
  return status === 'active';
};

export const isModuleDegraded = (moduleCode: string): boolean => {
  const status = moduleCache.get(moduleCode);
  return status === 'degraded';
};

export const isModuleInactive = (moduleCode: string): boolean => {
  const status = moduleCache.get(moduleCode);
  return status === 'inactive';
};

export const isModuleMaintenance = (moduleCode: string): boolean => {
  const status = moduleCache.get(moduleCode);
  return status === 'maintenance';
};

export const isAdminModule = (moduleCode: string): boolean => {
  return adminModules.has(moduleCode);
};

export const setAdminModule = (moduleCode: string): void => {
  adminModules.add(moduleCode);
};
