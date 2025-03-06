
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { supabase } from '@/integrations/supabase/client';
import { IModuleRepository } from '../domain/interfaces/IModuleRepository';

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
      // Use a simple string-based query to avoid type instantiation issues
      const { data, error } = await supabase
        .from('module_dependencies')
        .select(`
          id, 
          module_id,
          dependency_id,
          is_required,
          dependency:dependency_id (
            id, 
            name, 
            code, 
            status
          )
        `)
        .eq('module_id', moduleId);

      if (error) throw error;
      
      return Array.isArray(data) ? data : [];
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
  public async getModulesWithFeatures(): Promise<any[]> {
    try {
      // Use a simpler string-based query to avoid complex type instantiation
      const { data, error } = await supabase
        .from('module_features')
        .select(`
          id, 
          feature_code, 
          feature_name, 
          description, 
          is_enabled,
          module_code, 
          app_modules!inner(
            id, 
            name, 
            code, 
            description, 
            status
          )
        `);

      if (error) throw error;
      
      // Process the data to group features by module
      const moduleMap = new Map();
      
      for (const feature of data) {
        const moduleCode = feature.module_code;
        
        if (!moduleMap.has(moduleCode)) {
          moduleMap.set(moduleCode, {
            module: feature.app_modules,
            features: []
          });
        }
        
        moduleMap.get(moduleCode).features.push({
          id: feature.id,
          feature_code: feature.feature_code,
          feature_name: feature.feature_name,
          description: feature.description,
          is_enabled: feature.is_enabled
        });
      }
      
      return Array.from(moduleMap.values());
    } catch (error) {
      console.error('Error fetching modules with features:', error);
      return [];
    }
  }
}
