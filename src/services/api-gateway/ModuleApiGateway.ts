
import { supabase } from "@/integrations/supabase/client";

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
}

// Exporter une instance singleton
export const moduleApiGateway = new ModuleApiGateway();
