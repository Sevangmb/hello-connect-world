
import { ModuleStatus, AppModule } from '../types';
import { ADMIN_MODULE_CODE } from '../useModules';

// Cache for modules and features
let inMemoryModulesCache: AppModule[] | null = null;
let lastFetchTimestamp = 0;

/**
 * Mettre à jour le cache en mémoire
 */
export const updateModuleCache = (modules: AppModule[]) => {
  inMemoryModulesCache = modules;
  lastFetchTimestamp = Date.now();
};

/**
 * Obtenir le cache
 */
export const getModuleCache = () => {
  return { inMemoryModulesCache, lastFetchTimestamp };
};

/**
 * Vérifier si un module est le module admin ou commence par admin
 */
export const isAdminModule = (moduleCode: string): boolean => {
  return moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin');
};
