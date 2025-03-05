import { supabase } from '@/integrations/supabase/client';
import { AppModule, ModuleStatus } from '@/hooks/modules/types';

export class ModuleRepository {
  async getAllModules(): Promise<AppModule[]> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Convert to AppModule with all required fields
      return (data || []).map(module => ({
        ...module,
        // Add default values for fields that may be missing
        version: module.version || '1.0.0',
        is_admin: module.is_admin || false,
        priority: module.priority || 1,
        status: module.status as ModuleStatus
      })) as AppModule[];
    } catch (error) {
      console.error("Error fetching all modules:", error);
      return [];
    }
  }

  async getModuleByCode(code: string): Promise<AppModule | null> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      if (!data) return null;
      
      return {
        ...data,
        version: data.version || '1.0.0',
        is_admin: data.is_admin || false,
        priority: data.priority || 1,
        status: data.status as ModuleStatus
      } as AppModule;
    } catch (error) {
      console.error(`Error fetching module by code (${code}):`, error);
      return null;
    }
  }

  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      // Use type casting to resolve type conflict
      const statusAsString = status as any;
      
      const { error } = await supabase
        .from('app_modules')
        .update({ 
          status: statusAsString,
          updated_at: new Date().toISOString()
        })
        .eq('id', moduleId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error updating module status:", error);
      return false;
    }
  }

  async getAllFeatures(): Promise<ModuleFeature[]> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*');
      
      if (error) throw error;
      
      return data as ModuleFeature[];
    } catch (error) {
      console.error("Error fetching all features:", error);
      return [];
    }
  }

  async getModuleFeatures(moduleCode: string): Promise<ModuleFeature[]> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*')
        .eq('module_code', moduleCode);
      
      if (error) throw error;
      
      return data as ModuleFeature[];
    } catch (error) {
      console.error(`Error fetching features for module ${moduleCode}:`, error);
      return [];
    }
  }

  async updateFeatureStatus(featureId: string, isEnabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ 
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', featureId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error updating feature status:", error);
      return false;
    }
  }

  async getModuleById(id: string): Promise<AppModule | null> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      if (!data) return null;
      
      return {
        ...data,
        version: data.version || '1.0.0',
        is_admin: data.is_admin || false,
        priority: data.priority || 1,
        status: data.status as ModuleStatus
      } as AppModule;
    } catch (error) {
      console.error(`Error fetching module by id (${id}):`, error);
      return null;
    }
  }

  async getModulesByStatus(status: ModuleStatus): Promise<AppModule[]> {
    const { data, error } = await supabase
      .from('app_modules')
      .select('*')
      .eq('status', status)
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching modules by status:', error);
      return [];
    }

    return data;
  }

  async getCoreModules(): Promise<AppModule[]> {
    const { data, error } = await supabase
      .from('app_modules')
      .select('*')
      .eq('is_core', true)
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching core modules:', error);
      return [];
    }

    return data;
  }
}
