import { IModuleRepository } from "../domain/interfaces/IModuleRepository";
import { IFeatureRepository } from "../domain/interfaces/IFeatureRepository";
import { ModuleEventPublisher } from "../services/ModuleEventPublisher";

export class FeatureStatusUseCase {
  private moduleRepository: IModuleRepository;
  private featureRepository: IFeatureRepository;
  private moduleEventPublisher: ModuleEventPublisher;

  constructor(
    moduleRepository: IModuleRepository,
    featureRepository: IFeatureRepository,
    moduleEventPublisher: ModuleEventPublisher
  ) {
    this.moduleRepository = moduleRepository;
    this.featureRepository = featureRepository;
    this.moduleEventPublisher = moduleEventPublisher;
  }

  async enableFeature(moduleCode: string, featureCode: string): Promise<boolean> {
    return this.updateFeatureStatus(moduleCode, featureCode, true);
  }

  async disableFeature(moduleCode: string, featureCode: string): Promise<boolean> {
    return this.updateFeatureStatus(moduleCode, featureCode, false);
  }

  async getFeatureStatus(moduleCode: string, featureCode: string): Promise<boolean | null> {
    try {
      const feature = await this.featureRepository.getFeatureByCode(moduleCode, featureCode);
      if (!feature) {
        console.warn(`Feature ${moduleCode}.${featureCode} not found`);
        return null;
      }
      return feature.is_enabled;
    } catch (error) {
      console.error(`Error getting feature status for ${moduleCode}.${featureCode}:`, error);
      return null;
    }
  }

  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      // Check if the module exists and is active
      const moduleExists = await this.moduleRepository.getModuleByCode(moduleCode);
      if (!moduleExists) {
        console.error(`Module ${moduleCode} does not exist`);
        return false;
      }

      // Get all features for the module to check if this one exists
      const features = await this.featureRepository.getFeaturesByModule(moduleCode);
      const featureExists = features.some(feature => feature.feature_code === featureCode);
      
      if (!featureExists) {
        console.error(`Feature ${featureCode} does not exist for module ${moduleCode}`);
        return false;
      }
      
      // Update the feature status
      const success = await this.featureRepository.updateFeature(moduleCode, featureCode, isEnabled);
      
      if (success) {
        // Update the cache
        const { module_code, feature_code, isEnabled: enabled } = { 
          module_code: moduleCode, 
          feature_code: featureCode,
          isEnabled
        };
        
        // Publish an event for the feature status change
        this.moduleEventPublisher.publishFeatureStatusChanged(module_code, feature_code, enabled);
      }
      
      return success;
    } catch (error) {
      console.error(`Error updating feature status for ${moduleCode}.${featureCode}:`, error);
      return false;
    }
  }
}
