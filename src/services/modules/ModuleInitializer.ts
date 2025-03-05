
import { ModuleService } from './ModuleService';
import { ModuleInitializationService } from './ModuleInitializationService';

export class ModuleInitializer {
  private moduleService: ModuleService;
  private initService: ModuleInitializationService;

  constructor() {
    this.moduleService = new ModuleService();
    this.initService = new ModuleInitializationService();
  }

  /**
   * Initialize the application modules
   */
  async initialize(): Promise<void> {
    try {
      console.log('Starting module initialization...');
      
      // Initialize core modules
      await this.initService.initializeCoreModules();
      
      // Validate module dependencies
      await this.initService.validateModuleDependencies();
      
      // Preload active modules
      const activeModules = await this.moduleService.getActiveModules();
      console.log(`Preloaded ${activeModules.length} active modules`);
      
      console.log('Module initialization complete');
    } catch (error) {
      console.error('Error in module initialization:', error);
    }
  }

  /**
   * Check module health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const coreModules = await this.moduleService.getCoreModules();
      const inactiveCore = coreModules.filter(m => m.status !== 'active');
      
      if (inactiveCore.length > 0) {
        console.error('Some core modules are not active:', 
          inactiveCore.map(m => m.name).join(', '));
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking module health:', error);
      return false;
    }
  }
}
