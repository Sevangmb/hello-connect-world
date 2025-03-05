
import { ModuleStatus } from '@/hooks/modules/types';
import { ModuleService } from '@/services/modules/ModuleService';

// Create a singleton instance
let moduleServiceInstance: ModuleService | null = null;

export class ModuleApiGateway {
  private moduleService: ModuleService;
  private modules: any[] = [];

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
    const result = await this.moduleService.updateModuleStatus(moduleId, 'active');
    return !!result;
  }

  async deactivateModule(moduleId: string): Promise<boolean> {
    const result = await this.moduleService.updateModuleStatus(moduleId, 'inactive');
    return !!result;
  }

  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    return await this.moduleService.isFeatureEnabled(moduleCode, featureCode);
  }

  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    return await this.moduleService.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  }

  // Add missing methods
  async initialize(): Promise<boolean> {
    try {
      this.modules = await this.moduleService.getAllModules();
      return true;
    } catch (error) {
      console.error("Failed to initialize module API gateway:", error);
      return false;
    }
  }

  getModules(): any[] {
    return this.modules;
  }

  async refreshModules(force: boolean = false): Promise<any[]> {
    this.modules = await this.moduleService.getAllModules();
    return this.modules;
  }

  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    const result = await this.moduleService.updateModuleStatus(moduleId, status);
    return !!result;
  }

  isModuleDegraded(moduleCode: string): boolean {
    // This is a synchronous check, might need to be implemented differently
    return moduleCode ? false : false; // Placeholder implementation
  }
}

// Export a singleton instance for easier usage
export const moduleApiGateway = new ModuleApiGateway();
