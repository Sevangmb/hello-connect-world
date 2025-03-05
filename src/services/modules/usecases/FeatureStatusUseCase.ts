
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
  async isFeatureEnabled(moduleCode: string, featureCode: string, features?: Record<string, Record<string, boolean>>): Promise<boolean> {
    try {
      // If features cache is provided, use it
      if (features && features[moduleCode] && features[moduleCode][featureCode] !== undefined) {
        return features[moduleCode][featureCode];
      }
      
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
      const feature = await this.featureRepository.getFeatureByCode(moduleCode, featureCode);
      
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
      const feature = await this.featureRepository.getFeatureByCode(moduleCode, featureCode);
      
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
      return await this.featureRepository.getFeaturesByCode(moduleCode);
    } catch (error) {
      console.error(`Error getting features for module ${moduleCode}:`, error);
      return [];
    }
  }
  
  /**
   * Update features cache
   */
  updateFeatureCache(features: Record<string, Record<string, boolean>>): void {
    // Implementation for updating feature cache
    console.log("Updating feature cache", features);
    // Cache updating logic would go here
  }
  
  /**
   * Update feature status
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      const feature = await this.featureRepository.getFeatureByCode(moduleCode, featureCode);
      
      if (!feature) {
        return false;
      }
      
      return await this.featureRepository.updateFeatureStatus(feature.id, isEnabled);
    } catch (error) {
      console.error(`Error updating feature status ${featureCode} for module ${moduleCode}:`, error);
      return false;
    }
  }
}

// Fix for the featureStatusUseCase export
export const featureStatusUseCase = new FeatureStatusUseCase(
  // These will be replaced by DI at runtime
  {} as FeatureRepository, 
  {} as ModuleRepository
);
