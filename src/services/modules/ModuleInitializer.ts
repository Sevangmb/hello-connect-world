
import { AppModule } from '@/hooks/modules/types';
import { ModuleService } from './ModuleService';

export class ModuleInitializer {
  private moduleService: ModuleService;

  constructor() {
    this.moduleService = new ModuleService();
  }

  /**
   * Initialize modules
   */
  async initializeModules(): Promise<AppModule[]> {
    console.log('Initializing modules from ModuleInitializer...');
    try {
      // Get all active modules
      const modules = await this.moduleService.getActiveModules();
      
      // Initialize core modules first
      const coreModules = modules.filter(module => module.is_core);
      for (const module of coreModules) {
        await this.initializeModule(module.code);
      }
      
      // Initialize other modules
      const nonCoreModules = modules.filter(module => !module.is_core);
      for (const module of nonCoreModules) {
        await this.initializeModule(module.code);
      }
      
      return modules;
    } catch (error) {
      console.error('Error initializing modules:', error);
      return [];
    }
  }

  /**
   * Initialize a specific module
   */
  private async initializeModule(moduleCode: string): Promise<AppModule | null> {
    console.log(`Initializing module: ${moduleCode}`);
    try {
      return await this.moduleService.initializeModule(moduleCode);
    } catch (error) {
      console.error(`Error initializing module ${moduleCode}:`, error);
      return null;
    }
  }
}
