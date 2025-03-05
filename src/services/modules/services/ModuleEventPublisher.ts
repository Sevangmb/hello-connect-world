
import { eventBus } from '@/core/event-bus/EventBus';
import { ModuleStatus } from '@/hooks/modules/types';

/**
 * Events published by the module system
 */
export const MODULE_EVENTS = {
  MODULE_STATUS_CHANGED: 'module.statusChanged',
  MODULE_INITIALIZED: 'module.initialized',
  FEATURE_STATUS_CHANGED: 'module.featureStatusChanged',
  DEPENDENCY_ERROR: 'module.dependencyError',
  HEALTH_CHECK_ERROR: 'module.healthCheckError',
};

/**
 * Service for publishing module-related events
 */
export class ModuleEventPublisher {
  /**
   * Publish module status change event
   */
  publishModuleStatusUpdate(moduleCode: string, status: ModuleStatus): void {
    eventBus.publish(MODULE_EVENTS.MODULE_STATUS_CHANGED, { moduleCode, status });
  }

  /**
   * Publish module initialization event
   */
  publishModuleInitialized(moduleCode: string): void {
    eventBus.publish(MODULE_EVENTS.MODULE_INITIALIZED, { moduleCode });
  }

  /**
   * Publish feature status update event
   */
  publishFeatureUpdate(moduleCode: string, featureCode: string, isEnabled: boolean): void {
    eventBus.publish(MODULE_EVENTS.FEATURE_STATUS_CHANGED, { 
      moduleCode, 
      featureCode, 
      isEnabled 
    });
  }

  /**
   * Publish dependency error event
   */
  publishDependencyError(moduleCode: string, dependencyCode: string, error: string): void {
    eventBus.publish(MODULE_EVENTS.DEPENDENCY_ERROR, {
      moduleCode,
      dependencyCode,
      error
    });
  }

  /**
   * Publish health check error event
   */
  publishHealthCheckError(error: string): void {
    eventBus.publish(MODULE_EVENTS.HEALTH_CHECK_ERROR, { error });
  }
}
