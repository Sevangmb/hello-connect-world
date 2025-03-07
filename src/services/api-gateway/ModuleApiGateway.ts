
import { supabase } from "@/integrations/supabase/client";
import { ModuleStatus, AppModule } from '@/hooks/modules/types';

/**
 * Passerelle API pour les modules
 * Fournit un accès centralisé aux fonctionnalités liées aux modules
 */
class ModuleApiGateway {
  // Vérifier si un module est actif
  async isModuleActive(moduleCode: string): Promise<boolean> {
    try {
      // Les modules admin sont toujours considérés comme actifs
      if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
        return true;
      }
      
      // Vérifier dans la base de données
      const { data, error } = await supabase
        .from('app_modules')
        .select('status')
        .eq('code', moduleCode)
        .maybeSingle();
        
      if (error) {
        console.error(`Erreur lors de la vérification du statut du module ${moduleCode}:`, error);
        return false;
      }
      
      return data && data.status === 'active';
    } catch (error) {
      console.error(`Exception lors de la vérification du statut du module ${moduleCode}:`, error);
      return false;
    }
  }
  
  // Vérifier si une fonctionnalité est activée
  async isFeatureEnabled(moduleCode: string, featureCode: string): Promise<boolean> {
    try {
      // Vérifier d'abord si le module est actif
      const isActive = await this.isModuleActive(moduleCode);
      if (!isActive && moduleCode !== 'admin') {
        return false;
      }
      
      // Vérifier la fonctionnalité dans la base de données
      const { data, error } = await supabase
        .from('module_features')
        .select('is_enabled')
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode)
        .maybeSingle();
        
      if (error) {
        console.error(`Erreur lors de la vérification de la fonctionnalité ${featureCode} du module ${moduleCode}:`, error);
        return false;
      }
      
      return data ? data.is_enabled : false;
    } catch (error) {
      console.error(`Exception lors de la vérification de la fonctionnalité ${featureCode} du module ${moduleCode}:`, error);
      return false;
    }
  }

  // Récupérer le statut d'un module
  async getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('status')
        .eq('code', moduleCode)
        .maybeSingle();
        
      if (error) {
        console.error(`Erreur lors de la récupération du statut du module ${moduleCode}:`, error);
        return null;
      }
      
      return data?.status as ModuleStatus || null;
    } catch (error) {
      console.error(`Exception lors de la récupération du statut du module ${moduleCode}:`, error);
      return null;
    }
  }

  // Mettre à jour le statut d'un module
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_modules')
        .update({ status })
        .eq('id', moduleId);
        
      if (error) {
        console.error(`Erreur lors de la mise à jour du statut du module ${moduleId}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Exception lors de la mise à jour du statut du module ${moduleId}:`, error);
      return false;
    }
  }

  // Mettre à jour une fonctionnalité
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_features')
        .update({ is_enabled: isEnabled })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);
        
      if (error) {
        console.error(`Erreur lors de la mise à jour de la fonctionnalité ${featureCode} du module ${moduleCode}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Exception lors de la mise à jour de la fonctionnalité ${featureCode} du module ${moduleCode}:`, error);
      return false;
    }
  }

  // Récupérer tous les modules
  async getAllModules(): Promise<AppModule[]> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Erreur lors de la récupération des modules:', error);
        return [];
      }
      
      return data as AppModule[] || [];
    } catch (error) {
      console.error('Exception lors de la récupération des modules:', error);
      return [];
    }
  }
}

// Exporter une instance singleton
export const moduleApiGateway = new ModuleApiGateway();
