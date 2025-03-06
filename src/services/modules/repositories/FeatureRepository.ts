
import { supabase } from '@/integrations/supabase/client';

export class FeatureRepository {
  /**
   * Get a specific feature from a module
   */
  async getFeature(moduleCode: string, featureCode: string) {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*')
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching feature ${moduleCode}/${featureCode}:`, error);
      return null;
    }
  }

  /**
   * Update a feature's status
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ 
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        })
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
   * Get all features for a module
   */
  async getModuleFeatures(moduleCode: string) {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*')
        .eq('module_code', moduleCode);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching features for module ${moduleCode}:`, error);
      return [];
    }
  }

  /**
   * Get all features
   */
  async getAllFeatures() {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all features:', error);
      return [];
    }
  }
}
