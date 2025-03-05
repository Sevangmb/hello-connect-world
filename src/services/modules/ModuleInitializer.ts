
import { ModuleService } from './ModuleService';
import { moduleApiGateway } from '../api-gateway/ModuleApiGateway';
import { eventBus } from '@/core/event-bus/EventBus';

export class ModuleInitializer {
  private moduleService: ModuleService;
  
  constructor() {
    this.moduleService = new ModuleService();
  }
  
  /**
   * Initialize all modules
   */
  async initializeAllModules(): Promise<boolean> {
    try {
      console.info("Starting module system initialization");
      
      // Get all modules
      const modules = await this.moduleService.getAllModules();
      
      // Initialize each module, starting with core modules
      for (const module of modules) {
        if (module.is_core) {
          await this.initializeModule(module.code);
        }
      }
      
      // Then initialize non-core modules
      for (const module of modules) {
        if (!module.is_core) {
          await this.initializeModule(module.code);
        }
      }
      
      console.info("Module system initialization completed successfully");
      eventBus.publish('modules:initialized', {});
      
      return true;
    } catch (error) {
      console.error("Failed to initialize modules:", error);
      return false;
    }
  }
  
  /**
   * Initialize a specific module
   */
  async initializeModule(moduleCode: string): Promise<boolean> {
    try {
      console.info(`Initializing module: ${moduleCode}`);
      
      // Check if the module exists
      const moduleStatus = await this.moduleService.getModuleStatus(moduleCode);
      
      if (!moduleStatus) {
        console.warn(`Module ${moduleCode} not found`);
        return false;
      }
      
      // Check dependencies
      await this.moduleService.checkModuleDependencies(moduleCode);
      
      console.info(`Module ${moduleCode} initialized successfully`);
      eventBus.publish('module:initialized', { moduleCode });
      
      return true;
    } catch (error) {
      console.error(`Failed to initialize module ${moduleCode}:`, error);
      return false;
    }
  }
}

// Export a singleton instance
export const moduleInitializer = new ModuleInitializer();
