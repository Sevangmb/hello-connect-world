
import { ModuleRepository } from '../repositories/ModuleRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';
import { ModuleEventPublisher } from '../services/ModuleEventPublisher';

/**
 * Use case for managing feature status
 */
export class FeatureStatusUseCase {
  private moduleRepo: ModuleRepository;
  private featureRepo: FeatureRepository;
  private eventPublisher: ModuleEventPublisher;

  constructor(moduleRepo: ModuleRepository, featureRepo: FeatureRepository) {
    this.moduleRepo = moduleRepo;
    this.featureRepo = featureRepo;
    this.eventPublisher = new ModuleEventPublisher();
  }

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    try {
      // Check module status first
      const module = await this.moduleRepo.getModuleByCode(moduleCode);
      if (!module || module.status !== 'active') {
        return false;
      }
      
      // Then check if the feature is enabled
      const feature = await this.featureRepo.getFeature(moduleCode, featureCode);
      return feature ? feature.is_enabled : false;
    } catch (error) {
      console.error(`Error checking if feature ${featureCode} is enabled:`, error);
      return false;
    }
  }

  /**
   * Get all features for a module
   */
  async getFeaturesByModule(moduleCode: string): Promise<any[]> {
    try {
      return await this.featureRepo.getFeaturesByModule(moduleCode);
    } catch (error) {
      console.error(`Error getting features for module ${moduleCode}:`, error);
      return [];
    }
  }

  /**
   * Update feature status
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      // Check if module is active
      const module = await this.moduleRepo.getModuleByCode(moduleCode);
      if (!module) {
        console.error(`Module ${moduleCode} not found`);
        return false;
      }
      
      if (module.status !== 'active') {
        console.error(`Cannot update feature status for inactive module: ${moduleCode}`);
        return false;
      }
      
      // Update feature status
      const success = await this.featureRepo.updateFeatureStatus(moduleCode, featureCode, isEnabled);
      
      if (success) {
        // Publish event
        this.eventPublisher.publishFeatureUpdate(moduleCode, featureCode, isEnabled);
      }
      
      return success;
    } catch (error) {
      console.error(`Error updating feature ${featureCode} status:`, error);
      return false;
    }
  }
}
