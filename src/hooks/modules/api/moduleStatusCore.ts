
import { ModuleStatus } from '../types';

// Module status cache to minimize API calls
const moduleCache = new Map<string, ModuleStatus>();
const adminModules = new Set<string>();

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

export const getModuleCache = (): Map<string, ModuleStatus> => {
  return moduleCache;
};

export const updateModuleCache = (moduleCode: string, status: ModuleStatus): void => {
  moduleCache.set(moduleCode, status);
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
