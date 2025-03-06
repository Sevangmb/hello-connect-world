
import { AppModule } from '@/hooks/modules/types';
import { ModuleRepository } from './repositories/ModuleRepository';

export class ModuleService {
  private moduleRepository: ModuleRepository;

  constructor() {
    this.moduleRepository = new ModuleRepository();
  }

  /**
   * Initialize modules based on their priority and dependencies
   */
  public async initializeModules(): Promise<AppModule[]> {
    try {
      console.log('Initializing modules...');
      
      // Get all active modules
      const activeModules = await this.getActiveModules();
      
      // Sort by priority or dependency order if needed
      
      // Initialize each module
      for (const module of activeModules) {
        await this.initializeModule(module.code);
      }
      
      return activeModules;
    } catch (error) {
      console.error('Error initializing modules:', error);
      return [];
    }
  }

  /**
   * Initialize a specific module
   */
  public async initializeModule(moduleCode: string): Promise<AppModule | null> {
    try {
      console.log(`Initializing module: ${moduleCode}`);
      
      const module = await this.getModuleByCode(moduleCode);
      return module;
    } catch (error) {
      console.error(`Error initializing module ${moduleCode}:`, error);
      return null;
    }
  }

  /**
   * Get module by code
   */
  public async getModuleByCode(code: string): Promise<AppModule | null> {
    return this.moduleRepository.getModuleByCode(code);
  }

  /**
   * Get active modules
   */
  public async getActiveModules(): Promise<AppModule[]> {
    return this.moduleRepository.getModulesByStatus('active');
  }
}
