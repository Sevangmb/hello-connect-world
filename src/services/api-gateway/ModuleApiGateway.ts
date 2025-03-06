
import { BaseApiGateway } from './BaseApiGateway';
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { ModuleService } from '../modules/ModuleService';

export class ModuleApiGateway extends BaseApiGateway {
  private moduleService: ModuleService;

  constructor(moduleService: ModuleService) {
    super();
    this.moduleService = moduleService;
  }

  async initialize(): Promise<boolean> {
    try {
      await this.moduleService.initializeModules();
      return true;
    } catch (error) {
      console.error('Error initializing modules:', error);
      return false;
    }
  }

  /**
   * Check if a module is active
   */
  async isModuleActive(moduleCode: string): Promise<boolean> {
    return await this.moduleService.isModuleActive(moduleCode);
  }

  /**
   * Get a module's status
   */
  async getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
    return await this.moduleService.getModuleStatus(moduleCode);
  }

  /**
   * Activate a module
   */
  async activateModule(moduleId: string): Promise<boolean> {
    const result = await this.moduleService.updateModuleStatus(moduleId, 'active');
    return !!result;
  }

  /**
   * Deactivate a module
   */
  async deactivateModule(moduleId: string): Promise<boolean> {
    const result = await this.moduleService.updateModuleStatus(moduleId, 'inactive');
    return !!result;
  }

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    return await this.moduleService.isFeatureEnabled(moduleCode, featureCode);
  }

  /**
   * Enable or disable a feature
   */
  async setFeatureEnabled(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    return await this.moduleService.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  }

  /**
   * Get all modules (with filters)
   */
  async getModules(filters?: { status?: ModuleStatus; isCore?: boolean }): Promise<AppModule[]> {
    const modules = await this.moduleService.getAllModules();
    
    if (!filters) return modules;
    
    return modules.filter(module => {
      if (filters.status && module.status !== filters.status) return false;
      if (filters.isCore !== undefined && module.is_core !== filters.isCore) return false;
      return true;
    });
  }

  /**
   * Get all modules
   */
  async getAllModules(): Promise<AppModule[]> {
    return await this.moduleService.getAllModules();
  }

  /**
   * Update module status
   */
  async updateModuleStatus(id: string, status: ModuleStatus): Promise<boolean> {
    const result = await this.moduleService.updateModuleStatus(id, status);
    return !!result;
  }

  async refreshModules(): Promise<AppModule[]> {
    return await this.moduleService.getAllModules();
  }

  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    return await this.moduleService.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  }

  async isModuleDegraded(moduleId: string): Promise<boolean> {
    try {
      const module = await this.moduleService.getModuleByCode(moduleId);
      return module?.status === 'degraded';
    } catch (error) {
      console.error("Error checking if module is degraded:", error);
      return false;
    }
  }

  async getModuleById(moduleId: string): Promise<AppModule | null> {
    return await this.moduleService.getModuleByCode(moduleId);
  }
}

// Export singleton instance
export const moduleApiGateway = new ModuleApiGateway(new ModuleService());
