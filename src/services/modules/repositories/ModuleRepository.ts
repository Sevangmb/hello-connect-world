
import { supabase } from '@/integrations/supabase/client';
import { AppModule, ModuleStatus, ModuleFeature } from '@/hooks/modules/types';
import { IModuleRepository } from '../domain/interfaces/IModuleRepository';

export class ModuleRepository implements IModuleRepository {
  /**
   * Récupère tous les modules
   */
  async getAllModules(): Promise<AppModule[]> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;

      return data as AppModule[];
    } catch (error) {
      console.error('Error fetching all modules:', error);
      return [];
    }
  }

  /**
   * Récupère un module par son ID
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
   * Récupère un module par son code
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
   * Met à jour le statut d'un module
   */
  async updateModuleStatus(id: string, status: ModuleStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_modules')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error updating module status for ${id}:`, error);
      return false;
    }
  }

  /**
   * Récupère toutes les fonctionnalités des modules
   */
  async getAllFeatures(): Promise<ModuleFeature[]> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*');

      if (error) throw error;

      return data as ModuleFeature[];
    } catch (error) {
      console.error('Error fetching all features:', error);
      return [];
    }
  }

  /**
   * Récupère les fonctionnalités d'un module spécifique
   */
  async getFeaturesByModule(moduleCode: string): Promise<ModuleFeature[]> {
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

  /**
   * Met à jour le statut d'une fonctionnalité
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ is_enabled: isEnabled })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error updating feature status for ${moduleCode}/${featureCode}:`, error);
      return false;
    }
  }

  /**
   * Récupère les dépendances de modules
   */
  async getModuleDependencies(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('module_dependencies_view')
        .select('*');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching module dependencies:', error);
      return [];
    }
  }

  /**
   * Récupère les statistiques d'utilisation des modules
   */
  async getModuleUsageStats(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching module usage stats:', error);
      return [];
    }
  }

  /**
   * Incrémente le compteur d'utilisation d'un module
   */
  async incrementModuleUsage(moduleCode: string): Promise<boolean> {
    try {
      // First, check if record exists
      const { data, error: selectError } = await supabase
        .from('module_usage_stats')
        .select('id, usage_count')
        .eq('module_code', moduleCode)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        // Error other than "no rows returned"
        console.error('Error checking module usage record:', selectError);
        return false;
      }

      if (data) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('module_usage_stats')
          .update({ 
            usage_count: (data.usage_count || 0) + 1,
            last_used: new Date().toISOString()
          })
          .eq('id', data.id);

        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('module_usage_stats')
          .insert({ 
            module_code: moduleCode,
            usage_count: 1,
            last_used: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error(`Error incrementing usage for module ${moduleCode}:`, error);
      return false;
    }
  }

  // Implementing missing methods
  async createModule(moduleData: Omit<AppModule, 'id' | 'created_at' | 'updated_at'>): Promise<AppModule | null> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .insert(moduleData)
        .select()
        .single();

      if (error) throw error;
      return data as AppModule;
    } catch (error) {
      console.error('Error creating module:', error);
      return null;
    }
  }

  async updateModule(id: string, moduleData: Partial<AppModule>): Promise<AppModule | null> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .update(moduleData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as AppModule;
    } catch (error) {
      console.error('Error updating module:', error);
      return null;
    }
  }

  async deleteModule(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting module:', error);
      return false;
    }
  }

  // Add feature methods that were missing
  async createFeature(featureData: Omit<ModuleFeature, 'id' | 'created_at' | 'updated_at'>): Promise<ModuleFeature | null> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .insert(featureData)
        .select()
        .single();

      if (error) throw error;
      return data as ModuleFeature;
    } catch (error) {
      console.error('Error creating feature:', error);
      return null;
    }
  }

  async updateFeature(id: string, featureData: Partial<ModuleFeature>): Promise<ModuleFeature | null> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .update(featureData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ModuleFeature;
    } catch (error) {
      console.error('Error updating feature:', error);
      return null;
    }
  }

  async deleteFeature(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_features')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting feature:', error);
      return false;
    }
  }
}
