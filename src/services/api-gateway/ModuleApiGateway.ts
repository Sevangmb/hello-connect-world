
import { supabase } from '@/integrations/supabase/client';
import { BaseApiGateway } from './BaseApiGateway';
import { AppModule, ModuleStatus } from '@/hooks/modules/types';

export class ModuleApiGateway extends BaseApiGateway {
  constructor() {
    super();
  }

  async getModuleStatus(moduleCode: string): Promise<ModuleStatus> {
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

      return data.status as ModuleStatus;
    } catch (error) {
      console.error(`Error in getModuleStatus for ${moduleCode}:`, error);
      return 'inactive';
    }
  }

  async updateModuleStatus(moduleId: string, status: ModuleStatus) {
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
      const status = await this.getModuleStatus(moduleCode);
      return status === 'active';
    } catch (error) {
      console.error(`Exception in isModuleActive for ${moduleCode}:`, error);
      return false;
    }
  }

  async getAllModules(): Promise<AppModule[]> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching all modules:', error);
        return [];
      }

      return data as AppModule[];
    } catch (error) {
      console.error('Exception in getAllModules:', error);
      return [];
    }
  }
}

export const moduleApiGateway = new ModuleApiGateway();
