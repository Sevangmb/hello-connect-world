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
    return this.moduleRepository.getAllModules().then(modules => 
      modules.filter(module => module.status === status)
    );
  }

  /**
   * Get core modules
   */
  async getCoreModules(): Promise<AppModule[]> {
    return this.moduleRepository.getAllModules().then(modules => 
      modules.filter(module => module.is_core === true)
    );
  }

  /**
   * Initialize a module
   */
  async initializeModule(moduleCode: string): Promise<boolean> {
    console.log(`Initializing module: ${moduleCode}`);
    // Implementation will depend on specific requirements
    return true;
  }

  /**
   * Check if a module is active
   */
  async isModuleActive(moduleCode: string): Promise<boolean> {
    const module = await this.getModuleByCode(moduleCode);
    return module?.status === 'active';
  }
}
