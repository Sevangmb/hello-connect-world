
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { FeatureStatusUseCase } from './usecases/FeatureStatusUseCase';
import { moduleStatusUseCase } from './usecases/ModuleStatusUseCase';
import { ModuleRepository } from './repositories/ModuleRepository';
import { FeatureRepository } from './repositories/FeatureRepository';
import { DependencyRepository } from './repositories/DependencyRepository';

/**
 * Core service for module management
 */
export class ModuleService {
  private moduleRepo: ModuleRepository;
  private featureRepo: FeatureRepository;
  private dependencyRepo: DependencyRepository;
  private moduleStatusUseCase: typeof moduleStatusUseCase;
  private featureStatusUseCase: FeatureStatusUseCase;

  constructor() {
    this.moduleRepo = new ModuleRepository();
    this.featureRepo = new FeatureRepository();
    this.dependencyRepo = new DependencyRepository();
    this.moduleStatusUseCase = moduleStatusUseCase;
    this.featureStatusUseCase = new FeatureStatusUseCase(this.moduleRepo, this.featureRepo);
  }

  /**
   * Get all modules
   */
  async getAllModules(): Promise<AppModule[]> {
    return await this.moduleRepo.getAllModules();
  }

  /**
   * Get active modules
   */
  async getActiveModules(): Promise<AppModule[]> {
    return await this.moduleRepo.getModulesByStatus('active');
  }

  /**
   * Get core modules
   */
  async getCoreModules(): Promise<AppModule[]> {
    return await this.moduleRepo.getCoreModules();
  }

  /**
   * Get a module by code
   */
  async getModuleByCode(code: string): Promise<AppModule | null> {
    return await this.moduleRepo.getModuleByCode(code);
  }

  /**
   * Check if a module is active
   */
  async isModuleActive(moduleCode: string): Promise<boolean> {
    return await this.moduleStatusUseCase.isModuleActive(moduleCode);
  }

  /**
   * Get module status
   */
  async getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
    return await this.moduleStatusUseCase.getModuleStatus(moduleCode);
  }

  /**
   * Update module status
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    return await this.moduleStatusUseCase.updateModuleStatus(moduleId, status);
  }

  /**
   * Get module dependencies
   */
  async getModuleDependencies(moduleId: string): Promise<any[]> {
    return await this.dependencyRepo.getModuleDependencies(moduleId);
  }

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    return await this.featureStatusUseCase.isFeatureEnabled(moduleCode, featureCode);
  }

  /**
   * Get all features for a module
   */
  async getModuleFeatures(moduleCode: string): Promise<any[]> {
    return await this.featureRepo.getFeaturesByModule(moduleCode);
  }

  /**
   * Update feature status
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    return await this.featureStatusUseCase.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  }
}
