
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { IModuleService } from './IModuleService';
import { ModuleRepository } from '../repositories/ModuleRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';

export class ModuleServiceImpl implements IModuleService {
  private moduleRepository: ModuleRepository;
  private featureRepository: FeatureRepository;

  constructor(
    moduleRepository: ModuleRepository,
    featureRepository: FeatureRepository
  ) {
    this.moduleRepository = moduleRepository;
    this.featureRepository = featureRepository;
  }

  /**
   * Get all modules
   */
  async getAllModules(): Promise<AppModule[]> {
    return await this.moduleRepository.getAllModules();
  }

  /**
   * Get active modules
   */
  async getActiveModules(): Promise<AppModule[]> {
    return await this.moduleRepository.getModulesByStatus('active');
  }

  /**
   * Get module by ID
   */
  async getModuleById(id: string): Promise<AppModule | null> {
    return await this.moduleRepository.getModuleById(id);
  }

  /**
   * Get module by code
   */
  async getModuleByCode(code: string): Promise<AppModule | null> {
    return await this.moduleRepository.getModuleByCode(code);
  }

  /**
   * Get core modules
   */
  async getCoreModules(): Promise<AppModule[]> {
    return await this.moduleRepository.getCoreModules();
  }

  /**
   * Check if module is active
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
    return module?.status || null;
  }

  /**
   * Update module status
   */
  async updateModuleStatus(id: string, status: ModuleStatus): Promise<boolean> {
    return await this.moduleRepository.updateModuleStatus(id, status);
  }

  /**
   * Check if feature is enabled
   */
  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    const feature = await this.featureRepository.getFeature(moduleCode, featureCode);
    return feature?.is_enabled || false;
  }

  /**
   * Update feature status
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    return await this.featureRepository.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  }

  /**
   * Get module dependencies
   */
  async getModuleDependencies(moduleId: string): Promise<any[]> {
    return await this.moduleRepository.getModuleDependencies(moduleId);
  }
  
  // These methods are not implemented in the repository but are in the interface
  // Stubbing them to fix TypeScript errors
  
  /**
   * Create module (stub)
   */
  async createModule(module: Partial<AppModule>): Promise<AppModule | null> {
    console.warn('createModule not implemented in repository');
    return null;
  }
  
  /**
   * Update module (stub)
   */
  async updateModule(id: string, module: Partial<AppModule>): Promise<AppModule | null> {
    console.warn('updateModule not implemented in repository');
    return null;
  }
  
  /**
   * Delete module (stub)
   */
  async deleteModule(id: string): Promise<boolean> {
    console.warn('deleteModule not implemented in repository');
    return false;
  }
}
