
import { ModuleStatus } from '@/hooks/modules/types';
import { ModuleService } from '@/services/modules/ModuleService';

// Create a singleton instance
let moduleService: ModuleService | null = null;

export class ModuleApiGateway {
  private moduleService: ModuleService;

  constructor() {
    if (!moduleService) {
      moduleService = new ModuleService();
    }
    this.moduleService = moduleService;
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
}
