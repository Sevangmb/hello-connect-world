
import { ModuleServiceImpl } from '../modules/services/ModuleServiceImpl';
import { AppModule, ModuleStatus } from '@/hooks/modules/types';

export class ModuleApiGateway {
  private moduleService: ModuleServiceImpl;

  constructor() {
    this.moduleService = new ModuleServiceImpl();
  }

  public async getAllModules(): Promise<AppModule[]> {
    try {
      return await this.moduleService.getAllModules();
    } catch (error) {
      console.error('Error getting modules:', error);
      return [];
    }
  }

  public async getActiveModules(): Promise<AppModule[]> {
    try {
      return await this.moduleService.getActiveModules();
    } catch (error) {
      console.error('Error getting active modules:', error);
      return [];
    }
  }

  public async getModuleByCode(moduleCode: string): Promise<AppModule | null> {
    try {
      return await this.moduleService.getModuleByCode(moduleCode);
    } catch (error) {
      console.error(`Error getting module ${moduleCode}:`, error);
      return null;
    }
  }

  public async isModuleActive(moduleCode: string): Promise<boolean> {
    try {
      const status = await this.moduleService.getModuleStatus(moduleCode);
      return status === 'active';
    } catch (error) {
      console.error(`Error checking if module ${moduleCode} is active:`, error);
      return false;
    }
  }

  public async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      const result = await this.moduleService.updateModuleStatus(moduleId, status);
      return !!result;
    } catch (error) {
      console.error(`Error updating module ${moduleId} status:`, error);
      return false;
    }
  }

  public async updateFeatureStatus(
    moduleCode: string,
    featureCode: string,
    isEnabled: boolean
  ): Promise<boolean> {
    try {
      return await this.moduleService.updateFeatureStatus(moduleCode, featureCode, isEnabled);
    } catch (error) {
      console.error(`Error updating feature ${featureCode} status:`, error);
      return false;
    }
  }

  public async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    try {
      return await this.moduleService.isFeatureEnabled(moduleCode, featureCode);
    } catch (error) {
      console.error(`Error checking if feature ${featureCode} is enabled:`, error);
      return false;
    }
  }

  public async getModuleId(moduleCode: string): Promise<string | null> {
    try {
      const module = await this.moduleService.getModuleByCode(moduleCode);
      return module?.id || null;
    } catch (error) {
      console.error(`Error getting module ${moduleCode} ID:`, error);
      return null;
    }
  }
  
  public async isModuleDegraded(moduleId: string): Promise<boolean> {
    try {
      const module = await this.moduleService.getModuleById(moduleId);
      return module?.status === 'degraded';
    } catch (error) {
      console.error(`Error checking if module ${moduleId} is degraded:`, error);
      return false;
    }
  }
  
  public async recordModuleUsage(moduleCode: string): Promise<void> {
    try {
      await this.moduleService.recordModuleUsage(moduleCode);
    } catch (error) {
      console.error(`Error recording module ${moduleCode} usage:`, error);
    }
  }
}
