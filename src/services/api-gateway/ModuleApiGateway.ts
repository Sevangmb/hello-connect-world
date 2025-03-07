
import { supabase } from '@/integrations/supabase/client';
import { BaseApiGateway } from './BaseApiGateway';

export class ModuleApiGateway extends BaseApiGateway {
  constructor() {
    super();
  }

  async getModuleStatus(moduleCode: string) {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('status')
        .eq('code', moduleCode)
        .single();

      if (error) {
        console.error(`Error fetching module status for ${moduleCode}:`, error);
        return 'inactive';
      }

      return data.status;
    } catch (error) {
      console.error(`Error in getModuleStatus for ${moduleCode}:`, error);
      return 'inactive';
    }
  }

  async updateModuleStatus(moduleId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .update({ status })
        .eq('id', moduleId)
        .select();

      if (error) {
        console.error(`Error updating module status for ${moduleId}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error in updateModuleStatus for ${moduleId}:`, error);
      return null;
    }
  }

  async updateFeatureStatus(featureId: string, isEnabled: boolean) {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .update({ is_enabled: isEnabled })
        .eq('id', featureId)
        .select();

      if (error) {
        console.error(`Error updating feature status for ${featureId}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error in updateFeatureStatus for ${featureId}:`, error);
      return null;
    }
  }

  async updateFeatureStatusSilent(featureId: string, isEnabled: boolean) {
    try {
      await this.updateFeatureStatus(featureId, isEnabled);
      return true;
    } catch (error) {
      console.error('Error in updateFeatureStatusSilent:', error);
      return false;
    }
  }

  async isModuleActive(moduleCode: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('is_module_active', { module_code: moduleCode });

      if (error) {
        console.error(`Error checking if module ${moduleCode} is active:`, error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error(`Exception in isModuleActive for ${moduleCode}:`, error);
      return false;
    }
  }
}

export const moduleApiGateway = new ModuleApiGateway();
