
/**
 * Service responsable des interactions avec la base de données pour les modules
 * Encapsule toutes les requêtes Supabase relatives aux modules
 */
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "../types";
import { circuitBreakerService } from "./CircuitBreakerService";
import { validateModuleStatus } from "../utils/statusValidation";

// Clés pour le circuit breaker
const CIRCUIT_KEYS = {
  MODULES: 'modules_fetch',
  FEATURES: 'features_fetch',
  DEPENDENCIES: 'dependencies_fetch',
  MODULE_UPDATE: 'module_update',
  FEATURE_UPDATE: 'feature_update'
};

class ModuleDbService {
  /**
   * Récupère tous les modules depuis Supabase
   */
  async fetchAllModules(): Promise<AppModule[]> {
    try {
      const modulesResult = await circuitBreakerService.execute(
        CIRCUIT_KEYS.MODULES,
        async () => {
          return await supabase
            .from('app_modules')
            .select('*')
            .order('name');
        }
      );

      if (modulesResult.error) {
        console.error('ModuleDbService: Erreur lors du chargement des modules:', modulesResult.error);
        throw modulesResult.error;
      }

      // Valider les statuts des modules
      const validModules = (modulesResult.data || []).map(module => {
        // S'assurer que le statut est valide
        let status = validateModuleStatus(module.status);
        return { ...module, status } as AppModule;
      });

      return validModules;
    } catch (error) {
      console.error('ModuleDbService: Exception lors du chargement des modules:', error);
      throw error;
    }
  }

  /**
   * Récupère toutes les fonctionnalités depuis Supabase
   */
  async fetchAllFeatures(): Promise<Record<string, Record<string, boolean>>> {
    try {
      const featuresResult = await circuitBreakerService.execute(
        CIRCUIT_KEYS.FEATURES,
        async () => {
          return await supabase
            .from('module_features')
            .select('*');
        }
      );

      if (featuresResult.error) {
        console.error('ModuleDbService: Erreur lors du chargement des fonctionnalités:', featuresResult.error);
        throw featuresResult.error;
      }

      // Organiser les fonctionnalités par module
      const featuresData: Record<string, Record<string, boolean>> = {};
      (featuresResult.data || []).forEach(feature => {
        if (!featuresData[feature.module_code]) {
          featuresData[feature.module_code] = {};
        }
        featuresData[feature.module_code][feature.feature_code] = feature.is_enabled;
      });

      return featuresData;
    } catch (error) {
      console.error('ModuleDbService: Exception lors du chargement des fonctionnalités:', error);
      throw error;
    }
  }

  /**
   * Récupère toutes les dépendances depuis Supabase
   */
  async fetchAllDependencies(): Promise<any[]> {
    try {
      const dependenciesResult = await circuitBreakerService.execute(
        CIRCUIT_KEYS.DEPENDENCIES,
        async () => {
          return await supabase
            .from('module_dependencies_view')
            .select('*');
        }
      );

      if (dependenciesResult.error) {
        console.error('ModuleDbService: Erreur lors du chargement des dépendances:', dependenciesResult.error);
        throw dependenciesResult.error;
      }

      return dependenciesResult.data || [];
    } catch (error) {
      console.error('ModuleDbService: Exception lors du chargement des dépendances:', error);
      throw error;
    }
  }

  /**
   * Met à jour le statut d'un module
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      const result = await circuitBreakerService.execute(
        CIRCUIT_KEYS.MODULE_UPDATE,
        async () => {
          return await supabase
            .from('app_modules')
            .update({
              status,
              updated_at: new Date().toISOString()
            })
            .eq('id', moduleId);
        }
      );

      if (result.error) {
        console.error('ModuleDbService: Erreur lors de la mise à jour du statut du module:', result.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('ModuleDbService: Exception lors de la mise à jour du statut du module:', error);
      return false;
    }
  }

  /**
   * Met à jour le statut d'une fonctionnalité
   */
  async updateFeatureStatus(
    moduleCode: string,
    featureCode: string,
    isEnabled: boolean
  ): Promise<boolean> {
    try {
      const result = await circuitBreakerService.execute(
        CIRCUIT_KEYS.FEATURE_UPDATE,
        async () => {
          return await supabase
            .from('module_features')
            .update({
              is_enabled: isEnabled,
              updated_at: new Date().toISOString()
            })
            .eq('module_code', moduleCode)
            .eq('feature_code', featureCode);
        }
      );

      if (result.error) {
        console.error('ModuleDbService: Erreur lors de la mise à jour de la fonctionnalité:', result.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('ModuleDbService: Exception lors de la mise à jour de la fonctionnalité:', error);
      return false;
    }
  }

  /**
   * Vérifier le statut de connexion à Supabase
   */
  async checkConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('app_modules').select('count').limit(1);
      return !error;
    } catch (e) {
      return false;
    }
  }
}

// Créer et exporter une instance unique pour toute l'application
export const moduleDbService = new ModuleDbService();
