
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { ModuleRepository } from './repositories/ModuleRepository';

export class ModuleService {
  private moduleRepository: ModuleRepository;

  constructor() {
    this.moduleRepository = new ModuleRepository();
  }

  /**
   * Get all modules
   */
  async getAllModules(): Promise<AppModule[]> {
    return this.moduleRepository.getAllModules();
  }

  /**
   * Get a module by code
   */
  async getModuleByCode(code: string): Promise<AppModule | null> {
    return this.moduleRepository.getModuleByCode(code);
  }

  /**
   * Get a module by ID
   */
  async getModuleById(id: string): Promise<AppModule | null> {
    return this.moduleRepository.getModuleById(id);
  }

  /**
   * Update a module's status
   */
  async updateModuleStatus(id: string, status: ModuleStatus): Promise<AppModule | null> {
    return this.moduleRepository.updateModuleStatus(id, status);
  }

  /**
   * Get modules by status
   */
  async getModulesByStatus(status: ModuleStatus): Promise<AppModule[]> {
    const modules = await this.moduleRepository.getAllModules();
    return modules.filter(module => module.status === status);
  }

  /**
   * Get core modules
   */
  async getCoreModules(): Promise<AppModule[]> {
    const modules = await this.moduleRepository.getAllModules();
    return modules.filter(module => module.is_core === true);
  }

  /**
   * Initialize a module
   */
  async initializeModule(moduleCode: string): Promise<AppModule | null> {
    console.log(`Initializing module: ${moduleCode}`);
    // Implementation will depend on specific requirements
    const module = await this.getModuleByCode(moduleCode);
    return module;  // Return the module, not a boolean
  }

  /**
   * Check if a module is active
   */
  async isModuleActive(moduleCode: string): Promise<boolean> {
    const module = await this.getModuleByCode(moduleCode);
    return module?.status === 'active';
  }

  /**
   * Get module status
   */
  async getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
    const module = await this.getModuleByCode(moduleCode);
    return module ? module.status : null;
  }

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    // Implementation depends on how features are stored
    return true;
  }

  /**
   * Update feature status
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    // Implementation depends on how features are stored
    return true;
  }

  /**
   * Check module dependencies
   */
  async checkModuleDependencies(moduleCode: string): Promise<boolean> {
    // Implementation depends on how dependencies are stored
    return true;
  }

  /**
   * Get active modules
   */
  async getActiveModules(): Promise<AppModule[]> {
    return this.getModulesByStatus('active');
  }

  /**
   * Get module dependencies
   */
  async getModuleDependencies(moduleId: string): Promise<any[]> {
    // Implementation depends on how dependencies are stored
    return [];
  }

  /**
   * Initialize all modules
   */
  async initializeModules(): Promise<AppModule[]> {
    // Get all active modules
    const modules = await this.getActiveModules();
    return modules;
  }
}
