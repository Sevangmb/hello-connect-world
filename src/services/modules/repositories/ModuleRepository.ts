
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { supabase } from '@/integrations/supabase/client';
import { IModuleRepository } from '../domain/interfaces/IModuleRepository';

// Define simple, non-recursive types for the return values
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

interface ModuleWithFeatures {
  module: ModuleBasicInfo;
  features: FeatureBasicInfo[];
}

export class ModuleRepository implements IModuleRepository {
  /**
   * Get all modules
   */
  async getAllModules(): Promise<AppModule[]> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('priority');

      if (error) throw error;
      return data as AppModule[];
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  }

  /**
   * Get module by ID
   */
  async getModuleById(id: string): Promise<AppModule | null> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as AppModule;
    } catch (error) {
      console.error(`Error fetching module by ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Get module by code
   */
  async getModuleByCode(code: string): Promise<AppModule | null> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .eq('code', code)
        .single();

      if (error) throw error;
      return data as AppModule;
    } catch (error) {
      console.error(`Error fetching module by code ${code}:`, error);
      return null;
    }
  }

  /**
   * Update module status
   */
  async updateModuleStatus(id: string, status: ModuleStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_modules')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating module status for ${id}:`, error);
      return false;
    }
  }

  /**
   * Get module dependencies
   */
  async getModuleDependencies(moduleId: string): Promise<any[]> {
    try {
      // Récupérer les dépendances pour le module
      const { data: dependencyData, error: dependencyError } = await supabase
        .from('module_dependencies')
        .select('id, module_id, dependency_id, is_required')
        .eq('module_id', moduleId);
      
      if (dependencyError) throw dependencyError;
      
      if (!dependencyData || dependencyData.length === 0) {
        return [];
      }
      
      // Récupérer les détails des modules de dépendance
      const dependencies: any[] = [];
      
      for (const dep of dependencyData) {
        const { data: moduleData, error: moduleError } = await supabase
          .from('app_modules')
          .select('id, name, code, status')
          .eq('id', dep.dependency_id)
          .single();
          
        if (moduleError) {
          console.error(`Error fetching dependency module ${dep.dependency_id}:`, moduleError);
          continue;
        }
        
        if (moduleData) {
          dependencies.push({
            id: dep.id,
            module_id: dep.module_id,
            dependency_id: dep.dependency_id,
            is_required: dep.is_required,
            dependency: moduleData
          });
        }
      }
      
      return dependencies;
    } catch (error) {
      console.error(`Error fetching dependencies for module ${moduleId}:`, error);
      return [];
    }
  }
  
  /**
   * Get modules by status
   */
  async getModulesByStatus(status: ModuleStatus): Promise<AppModule[]> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .eq('status', status)
        .order('priority');

      if (error) throw error;
      return data as AppModule[];
    } catch (error) {
      console.error(`Error fetching modules with status ${status}:`, error);
      return [];
    }
  }
  
  /**
   * Get core modules
   */
  async getCoreModules(): Promise<AppModule[]> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .eq('is_core', true)
        .order('priority');

      if (error) throw error;
      return data as AppModule[];
    } catch (error) {
      console.error('Error fetching core modules:', error);
      return [];
    }
  }
  
  /**
   * Get module usage stats
   */
  async getModuleUsageStats(moduleId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('*')
        .eq('module_id', moduleId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching usage stats for module ${moduleId}:`, error);
      return null;
    }
  }

  /**
   * Get modules with features
   */
  public async getModulesWithFeatures(): Promise<ModuleWithFeatures[]> {
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
      
      // Build the result array directly with proper typing
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
          // Use explicit iteration instead of array methods to avoid complex type inference
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

  /**
   * Get module status
   */
  async getModuleStatus(moduleCode: string): Promise<ModuleStatus> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('status')
        .eq('code', moduleCode)
        .single();

      if (error) {
        console.error(`Error fetching module status: ${error.message}`);
        return 'inactive';
      }

      return data?.status || 'inactive';
    } catch (error) {
      console.error(`Error in getModuleStatus: ${error}`);
      return 'inactive';
    }
  }
}
