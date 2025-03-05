
import { AppModule, ModuleStatus } from "../types";
import { supabase } from '@/integrations/supabase/client';

// Cache structure
interface ModuleCache {
  [moduleCode: string]: {
    status: ModuleStatus;
    timestamp: number;
  };
}

// In-memory module cache
const moduleStatusCache: ModuleCache = {};

/**
 * Check if a module is an admin module
 */
export function isAdminModule(moduleCode: string): boolean {
  return moduleCode === 'admin' || moduleCode.startsWith('admin_');
}

/**
 * Check if a module is a system module
 */
export function isSystemModule(moduleCode: string): boolean {
  return moduleCode === 'system' || moduleCode === 'core';
}

/**
 * Check if a module is a core module
 */
export function isCoreModule(module: AppModule): boolean {
  return module.is_core === true;
}

/**
 * Update the module cache
 */
export function updateModuleCache(modules: AppModule[]): void {
  modules.forEach(module => {
    moduleStatusCache[module.code] = {
      status: module.status,
      timestamp: Date.now()
    };
  });
}

/**
 * Get a module's status from cache
 */
export function getModuleStatusFromCache(moduleCode: string): ModuleStatus | null {
  const cached = moduleStatusCache[moduleCode];
  if (cached && (Date.now() - cached.timestamp < 30000)) { // 30 second cache validity
    return cached.status;
  }
  return null;
}

/**
 * Get the module cache
 */
export function getModuleCache(): ModuleCache {
  return moduleStatusCache;
}
