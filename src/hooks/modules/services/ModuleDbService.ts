
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "../types";
import { moduleRegistry } from "./ModuleRegistry";

/**
 * Service responsable des opérations de base de données pour les modules
 */
export class ModuleDbService {
  /**
   * Charger tous les modules depuis la base de données
   */
  static async loadAllModules(): Promise<AppModule[]> {
    try {
      console.log("Chargement des modules depuis la base de données");
      
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');
        
      if (error) {
        console.error("Erreur lors du chargement des modules:", error);
        throw error;
      }
      
      // Convertir les statuts vers ModuleStatus valide
      const modules = (data || []).map(module => {
        let status = module.status;
        if (status !== 'active' && status !== 'inactive' && status !== 'degraded') {
          status = 'inactive';
        }
        return { ...module, status } as AppModule;
      });
      
      console.log(`${modules.length} modules chargés depuis la base de données`);
      return modules;
    } catch (error) {
      console.error("Exception lors du chargement des modules:", error);
      throw error;
    }
  }
  
  /**
   * Charger les fonctionnalités des modules depuis la base de données
   */
  static async loadAllFeatures(): Promise<Record<string, Record<string, boolean>>> {
    try {
      console.log("Chargement des fonctionnalités depuis la base de données");
      
      const { data, error } = await supabase
        .from('module_features')
        .select('*');
        
      if (error) {
        console.error("Erreur lors du chargement des fonctionnalités:", error);
        throw error;
      }
      
      // Organiser les fonctionnalités par module
      const features: Record<string, Record<string, boolean>> = {};
      
      (data || []).forEach(feature => {
        if (!features[feature.module_code]) {
          features[feature.module_code] = {};
        }
        features[feature.module_code][feature.feature_code] = feature.is_enabled;
      });
      
      console.log(`Fonctionnalités chargées pour ${Object.keys(features).length} modules`);
      return features;
    } catch (error) {
      console.error("Exception lors du chargement des fonctionnalités:", error);
      throw error;
    }
  }
  
  /**
   * Mettre à jour le statut d'un module dans la base de données
   */
  static async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      console.log(`Mise à jour du statut du module ${moduleId} à ${status}`);
      
      const { error } = await supabase
        .from('app_modules')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', moduleId);
        
      if (error) {
        console.error("Erreur lors de la mise à jour du statut du module:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Exception lors de la mise à jour du statut du module:", error);
      return false;
    }
  }
  
  /**
   * Mettre à jour le statut d'une fonctionnalité dans la base de données
   */
  static async updateFeatureStatus(
    moduleCode: string, 
    featureCode: string, 
    isEnabled: boolean
  ): Promise<boolean> {
    try {
      console.log(`Mise à jour de la fonctionnalité ${featureCode} du module ${moduleCode} à ${isEnabled}`);
      
      const { error } = await supabase
        .from('module_features')
        .update({ 
          is_enabled: isEnabled, 
          updated_at: new Date().toISOString() 
        })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);
        
      if (error) {
        console.error("Erreur lors de la mise à jour de la fonctionnalité:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Exception lors de la mise à jour de la fonctionnalité:", error);
      return false;
    }
  }

  /**
   * Synchroniser l'état du registre des modules avec la base de données
   */
  static async syncRegistryToDatabase(): Promise<boolean> {
    try {
      // Charger tous les modules depuis la base de données
      const dbModules = await this.loadAllModules();
      
      // Comparer avec l'état actuel du registre et appliquer les mises à jour nécessaires
      let allSuccessful = true;
      
      for (const module of dbModules) {
        const registryStatus = moduleRegistry.getModuleStatus(module.code);
        
        if (module.status !== registryStatus) {
          const success = await this.updateModuleStatus(module.id, registryStatus);
          if (!success) {
            allSuccessful = false;
          }
        }
      }
      
      // TODO: Ajouter la synchronisation des fonctionnalités
      
      return allSuccessful;
    } catch (error) {
      console.error("Exception lors de la synchronisation du registre:", error);
      return false;
    }
  }
}
