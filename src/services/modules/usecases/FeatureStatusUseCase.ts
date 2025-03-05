
import { ModuleStatus } from "@/hooks/modules/types";
import { FeatureRepository } from "../repositories/FeatureRepository";
import { ModuleRepository } from "../repositories/ModuleRepository";

export class FeatureStatusUseCase {
  private featureRepository: FeatureRepository;
  private moduleRepository: ModuleRepository;

  constructor(featureRepository: FeatureRepository, moduleRepository: ModuleRepository) {
    this.featureRepository = featureRepository;
    this.moduleRepository = moduleRepository;
  }

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    try {
      // First check if the module is active
      const module = await this.moduleRepository.getModuleByCode(moduleCode);
      if (!module || module.status !== 'active') {
        return false;
      }

      // Then check if the feature is enabled
      const feature = await this.featureRepository.getFeatureByCode(moduleCode, featureCode);
      return feature?.is_enabled || false;
    } catch (error) {
      console.error(`Error checking if feature ${featureCode} is enabled for module ${moduleCode}:`, error);
      return false;
    }
  }

  /**
   * Enable a feature
   */
  async enableFeature(moduleCode: string, featureCode: string): Promise<boolean> {
    try {
      // First check if the module is active
      const module = await this.moduleRepository.getModuleByCode(moduleCode);
      if (!module || module.status !== 'active') {
        return false;
      }

      // Then enable the feature
      return await this.featureRepository.updateFeatureStatus(moduleCode, featureCode, true);
    } catch (error) {
      console.error(`Error enabling feature ${featureCode} for module ${moduleCode}:`, error);
      return false;
    }
  }

  /**
   * Disable a feature
   */
  async disableFeature(moduleCode: string, featureCode: string): Promise<boolean> {
    try {
      return await this.featureRepository.updateFeatureStatus(moduleCode, featureCode, false);
    } catch (error) {
      console.error(`Error disabling feature ${featureCode} for module ${moduleCode}:`, error);
      return false;
    }
  }

  /**
   * Get all features for a module
   */
  async getModuleFeatures(moduleCode: string): Promise<any[]> {
    try {
      return await this.featureRepository.getModuleFeatures(moduleCode);
    } catch (error) {
      console.error(`Error getting features for module ${moduleCode}:`, error);
      return [];
    }
  }
}
