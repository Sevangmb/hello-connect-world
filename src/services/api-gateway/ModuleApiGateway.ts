
import { ModuleStatus } from '@/hooks/modules/types';
import { ModuleService } from '@/services/modules/ModuleService';

// Create a singleton instance
let moduleServiceInstance: ModuleService | null = null;

export class ModuleApiGateway {
  private moduleService: ModuleService;

  constructor() {
    if (!moduleServiceInstance) {
      moduleServiceInstance = new ModuleService();
    }
    this.moduleService = moduleServiceInstance;
  }

  async isModuleActive(moduleCode: string): Promise<boolean> {
    return await this.moduleService.isModuleActive(moduleCode);
  }

  async getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
    return await this.moduleService.getModuleStatus(moduleCode);
  }

  async activateModule(moduleId: string): Promise<boolean> {
    return await this.moduleService.updateModuleStatus(moduleId, 'active');
  }

  async deactivateModule(moduleId: string): Promise<boolean> {
    return await this.moduleService.updateModuleStatus(moduleId, 'inactive');
  }

  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    return await this.moduleService.isFeatureEnabled(moduleCode, featureCode);
  }

  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    return await this.moduleService.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  }

  // Add missing methods needed by the application
  async getModules(): Promise<any[]> {
    return await this.moduleService.getAllModules();
  }

  async initialize(): Promise<boolean> {
    try {
      await this.moduleService.initialize();
      return true;
    } catch (error) {
      console.error("Failed to initialize module API gateway:", error);
      return false;
    }
  }

  async refreshModules(): Promise<any[]> {
    // Implement refreshing modules logic
    return await this.getModules();
  }

  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    return await this.moduleService.updateModuleStatus(moduleId, status);
  }

  isModuleDegraded(moduleCode: string): boolean {
    // This is a synchronous check, might need to be implemented differently
    return moduleCode ? false : false; // Placeholder implementation
  }
}

// Export a singleton instance for easier usage
export const moduleApiGateway = new ModuleApiGateway();
