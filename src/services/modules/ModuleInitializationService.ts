
import { ModuleService } from './ModuleService';

export class ModuleInitializationService {
  private moduleService: ModuleService;

  constructor() {
    this.moduleService = new ModuleService();
  }

  /**
   * Initialize core modules when application starts
   */
  async initializeCoreModules(): Promise<void> {
    try {
      console.log('Initializing core modules...');
      
      // Ensure core modules are activated
      const coreModules = await this.moduleService.getCoreModules();
      
      for (const module of coreModules) {
        if (module.status !== 'active') {
          await this.moduleService.updateModuleStatus(module.id, 'active');
          console.log(`Activated core module: ${module.name}`);
        }
      }
      
      console.log('Core modules initialization complete');
    } catch (error) {
      console.error('Error initializing core modules:', error);
    }
  }

  /**
   * Validate module dependencies
   */
  async validateModuleDependencies(): Promise<void> {
    try {
      console.log('Validating module dependencies...');
      
      // Get all active modules
      const activeModules = await this.moduleService.getActiveModules();
      
      for (const module of activeModules) {
        const dependencies = await this.moduleService.getModuleDependencies(module.id);
        const missingDependencies = dependencies.filter(
          dep => dep.is_required && dep.dependency_status !== 'active'
        );
        
        if (missingDependencies.length > 0) {
          console.warn(`Module ${module.name} has missing required dependencies:`, 
            missingDependencies.map(d => d.dependency_name).join(', '));
            
          // If missing required dependencies, deactivate the module
          await this.moduleService.updateModuleStatus(module.id, 'inactive');
          console.log(`Deactivated module ${module.name} due to missing dependencies`);
        }
      }
      
      console.log('Module dependencies validation complete');
    } catch (error) {
      console.error('Error validating module dependencies:', error);
    }
  }
}
