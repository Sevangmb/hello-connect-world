
import { useEffect } from 'react';
import { AppModule, ModuleDependency, ModuleStatus } from './types';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '@/services/modules/ModuleEvents';

/**
 * Process incoming module data for consistency
 */
const processModuleData = (module: any): AppModule => {
  const status = module.status as ModuleStatus;
  
  // Ensure we have a valid status
  const validStatus = status === 'active' || 
                      status === 'inactive' || 
                      status === 'degraded' || 
                      status === 'maintenance' ? 
                      status : 'inactive';
  
  // Return a fully-formed module with defaults for missing properties
  return {
    id: module.id,
    code: module.code,
    name: module.name,
    description: module.description || '',
    status: validStatus,
    is_core: !!module.is_core,
    version: module.version || '1.0.0',
    created_at: module.created_at || new Date().toISOString(),
    updated_at: module.updated_at || new Date().toISOString(),
    is_admin: module.is_admin || false,
    priority: module.priority || 0,
    features: module.features || {}
  };
};

/**
 * Process incoming dependency data for consistency
 */
const processDependencyData = (dependency: any): ModuleDependency => {
  return {
    id: dependency.id || `${dependency.module_id}_${dependency.dependency_id}`,
    module_id: dependency.module_id,
    module_code: dependency.module_code,
    module_name: dependency.module_name,
    module_status: dependency.module_status || 'inactive',
    dependency_id: dependency.dependency_id,
    dependency_code: dependency.dependency_code,
    dependency_name: dependency.dependency_name,
    dependency_status: dependency.dependency_status || 'inactive',
    depends_on: dependency.depends_on || dependency.dependency_code || '',
    is_required: !!dependency.is_required,
    created_at: dependency.created_at || new Date().toISOString(),
    updated_at: dependency.updated_at || new Date().toISOString()
  };
};

/**
 * Subscribe to module events via event bus
 */
export const useModuleSubscriptions = (
  setModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
  setDependencies: React.Dispatch<React.SetStateAction<ModuleDependency[]>>,
) => {
  useEffect(() => {
    // Subscribe to module updates
    const subscription = eventBus.subscribe(MODULE_EVENTS.MODULES_REFRESHED, (event) => {
      if (event.modules) {
        const processedModules = event.modules.map(processModuleData);
        setModules(processedModules);
      }
    });

    // Subscribe to dependency updates
    const depSubscription = eventBus.subscribe(MODULE_EVENTS.DEPENDENCIES_UPDATED, (event) => {
      if (event.dependencies) {
        const processedDependencies = event.dependencies.map(processDependencyData);
        setDependencies(processedDependencies);
      }
    });

    return () => {
      subscription.unsubscribe();
      depSubscription.unsubscribe();
    };
  }, [setModules, setDependencies]);
};
