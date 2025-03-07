
import { supabase } from '@/integrations/supabase/client';
import { ModuleStatus } from '@/hooks/modules/types';

// Define types for the module features functionality
interface ModuleBasicInfo {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: ModuleStatus;
}

interface FeatureBasicInfo {
  id: string;
  feature_code: string;
  feature_name: string;
  description: string;
  is_enabled: boolean;
}

export interface ModuleWithFeatures {
  module: ModuleBasicInfo;
  features: FeatureBasicInfo[];
}

export class ModuleFeatureRepository {
  /**
   * Get modules with features
   */
  async getModulesWithFeatures(): Promise<ModuleWithFeatures[]> {
    try {
      // First, fetch all modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('app_modules')
        .select('id, name, code, description, status');
      
      if (modulesError) {
        console.error('Error fetching modules:', modulesError);
        return [];
      }
      
      if (!modulesData || modulesData.length === 0) {
        return [];
      }
      
      // Then fetch all features
      const { data: featuresData, error: featuresError } = await supabase
        .from('module_features')
        .select('id, feature_code, feature_name, description, is_enabled, module_code');
        
      if (featuresError) {
        console.error('Error fetching features:', featuresError);
        return [];
      }
      
      // Build the result array
      const result: ModuleWithFeatures[] = [];
      
      // Process each module
      for (const module of modulesData) {
        const moduleInfo: ModuleBasicInfo = {
          id: module.id,
          name: module.name,
          code: module.code,
          description: module.description,
          status: module.status as ModuleStatus
        };
        
        // Find features for this module
        const moduleFeatures: FeatureBasicInfo[] = [];
        
        if (featuresData) {
          // Use explicit iteration instead of array methods
          for (let i = 0; i < featuresData.length; i++) {
            const feature = featuresData[i];
            if (feature.module_code === module.code) {
              moduleFeatures.push({
                id: feature.id,
                feature_code: feature.feature_code,
                feature_name: feature.feature_name,
                description: feature.description || '',
                is_enabled: feature.is_enabled
              });
            }
          }
        }
        
        // Add this module with its features to the result
        result.push({
          module: moduleInfo,
          features: moduleFeatures
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching modules with features:', error);
      return [];
    }
  }
}
