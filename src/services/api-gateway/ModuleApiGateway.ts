
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "@/hooks/modules/types";

class ModuleApiGateway {
  /**
   * Récupère tous les modules
   */
  async getAllModules(): Promise<AppModule[]> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as AppModule[];
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
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
      
      if (error) return null;
      return data as AppModule;
    } catch (error) {
      console.error(`Error fetching module with code ${code}:`, error);
      return null;
    }
  }

  /**
   * Récupère le statut d'un module
   */
  async getModuleStatus(code: string): Promise<ModuleStatus | null> {
    try {
      const module = await this.getModuleByCode(code);
      return module?.status || null;
    } catch (error) {
      console.error(`Error fetching status for module ${code}:`, error);
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
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating status for module ${id}:`, error);
      return false;
    }
  }

  /**
   * Vérifie si une fonctionnalité est activée
   */
  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('is_enabled')
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode)
        .single();
      
      if (error) return false;
      return !!data.is_enabled;
    } catch (error) {
      console.error(`Error checking feature ${featureCode} for module ${moduleCode}:`, error);
      return false;
    }
  }

  /**
   * Met à jour le statut d'une fonctionnalité
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating feature ${featureCode} for module ${moduleCode}:`, error);
      return false;
    }
  }

  /**
   * Met à jour silencieusement le statut d'une fonctionnalité
   */
  async updateFeatureStatusSilent(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    return this.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  }
}

export const moduleApiGateway = new ModuleApiGateway();
export default moduleApiGateway;
