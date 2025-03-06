
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { ModuleRepository } from '../repositories/ModuleRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';
import { IModuleService } from '../domain/interfaces/IModuleService';
import { supabase } from '@/integrations/supabase/client';

export class ModuleServiceImpl implements IModuleService {
  private moduleRepository: ModuleRepository;
  private featureRepository: FeatureRepository;
  
  constructor(moduleRepository: ModuleRepository) {
    this.moduleRepository = moduleRepository;
    this.featureRepository = new FeatureRepository();
  }

  /**
   * Initialize modules based on their priority and dependencies
   */
  public async initializeModules(): Promise<AppModule[]> {
    try {
      console.log('Initializing modules...');
      
      // Get all active modules
      const activeModules = await this.getActiveModules();
      
      // Sort by priority or dependency order if needed
      
      // Initialize each module
      for (const module of activeModules) {
        await this.initializeModule(module.code);
      }
      
      return activeModules;
    } catch (error) {
      console.error('Error initializing modules:', error);
      return [];
    }
  }

  /**
   * Initialize a specific module
   */
  public async initializeModule(moduleCode: string): Promise<AppModule | null> {
    try {
      console.log(`Initializing module: ${moduleCode}`);
      
      const module = await this.getModuleByCode(moduleCode);
      return module;
    } catch (error) {
      console.error(`Error initializing module ${moduleCode}:`, error);
      return null;
    }
  }

  /**
   * Get module by code
   */
  public async getModuleByCode(code: string): Promise<AppModule | null> {
    return this.moduleRepository.getModuleByCode(code);
  }

  /**
   * Get active modules
   */
  public async getActiveModules(): Promise<AppModule[]> {
    return this.moduleRepository.getModulesByStatus('active');
  }
  
  /**
   * Get all modules
   */
  public async getAllModules(): Promise<AppModule[]> {
    return this.moduleRepository.getAllModules();
  }
  
  /**
   * Check if a module is active
   */
  public async isModuleActive(moduleCode: string): Promise<boolean> {
    const module = await this.getModuleByCode(moduleCode);
    return module?.status === 'active';
  }
  
  /**
   * Get a module's status
   */
  public async getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
    const module = await this.getModuleByCode(moduleCode);
    return module?.status || null;
  }
  
  /**
   * Update a module's status
   */
  public async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<AppModule | null> {
    try {
      await this.moduleRepository.updateModuleStatus(moduleId, status);
      const module = await this.moduleRepository.getModuleById(moduleId);
      return module;
    } catch (error) {
      console.error(`Error updating module status: ${error}`);
      return null;
    }
  }
  
  /**
   * Check if a feature is enabled
   */
  public async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    try {
      const feature = await this.featureRepository.getFeature(moduleCode, featureCode);
      return feature?.is_enabled || false;
    } catch (error) {
      console.error(`Error checking if feature is enabled: ${error}`);
      return false;
    }
  }
  
  /**
   * Update a feature's status
   */
  public async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      return await this.featureRepository.updateFeatureStatus(moduleCode, featureCode, isEnabled);
    } catch (error) {
      console.error(`Error updating feature status: ${error}`);
      return false;
    }
  }
  
  /**
   * Get core modules
   */
  public async getCoreModules(): Promise<AppModule[]> {
    try {
      return await this.moduleRepository.getCoreModules();
    } catch (error) {
      console.error(`Error getting core modules: ${error}`);
      return [];
    }
  }
  
  /**
   * Get module dependencies
   */
  public async getModuleDependencies(moduleId: string): Promise<any[]> {
    try {
      return await this.moduleRepository.getModuleDependencies(moduleId);
    } catch (error) {
      console.error(`Error getting module dependencies: ${error}`);
      return [];
    }
  }

  /**
   * Record module usage
   */
  public async recordModuleUsage(moduleCode: string): Promise<void> {
    try {
      await supabase.rpc('increment_module_usage', { module_code: moduleCode });
    } catch (error) {
      console.error('Error recording module usage:', error);
    }
  }
}
