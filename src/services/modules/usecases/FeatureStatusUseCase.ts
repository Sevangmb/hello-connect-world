
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
      const feature = await this.featureRepository.getFeaturesByModule(moduleCode)
        .then(features => features.find(f => f.feature_code === featureCode));
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
      const features = await this.featureRepository.getFeaturesByModule(moduleCode);
      const feature = features.find(f => f.feature_code === featureCode);
      
      if (!feature) {
        return false;
      }
      
      return await this.featureRepository.updateFeatureStatus(feature.id, true);
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
      const features = await this.featureRepository.getFeaturesByModule(moduleCode);
      const feature = features.find(f => f.feature_code === featureCode);
      
      if (!feature) {
        return false;
      }
      
      return await this.featureRepository.updateFeatureStatus(feature.id, false);
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
      return await this.featureRepository.getFeaturesByModule(moduleCode);
    } catch (error) {
      console.error(`Error getting features for module ${moduleCode}:`, error);
      return [];
    }
  }
}

// Export a named instance for use in ModuleService
export const featureStatusUseCase = new FeatureStatusUseCase(
  // These will be replaced by DI at runtime
  {} as FeatureRepository, 
  {} as ModuleRepository
);
