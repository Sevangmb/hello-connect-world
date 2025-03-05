/**
 * Repository pour l'accès aux données des fonctionnalités
 */
import { supabase } from '@/integrations/supabase/client';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '../ModuleEvents';

export class FeatureRepository {
  /**
   * Récupère toutes les fonctionnalités
   * @returns Promise<Record<string, Record<string, boolean>>> Fonctionnalités organisées par module
   */
  async fetchAllFeatures(): Promise<Record<string, Record<string, boolean>>> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Organiser les fonctionnalités par module
      const featuresData: Record<string, Record<string, boolean>> = {};
      (data || []).forEach(feature => {
        if (!featuresData[feature.module_code]) {
          featuresData[feature.module_code] = {};
        }
        featuresData[feature.module_code][feature.feature_code] = feature.is_enabled;
      });
      
      return featuresData;
    } catch (error) {
      console.error("Erreur lors du chargement des fonctionnalités:", error);
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: "Erreur lors du chargement des fonctionnalités",
        context: "features",
        timestamp: Date.now()
      });
      throw error;
    }
  }

  /**
   * Met à jour le statut d'une fonctionnalité
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @param isEnabled Statut d'activation
   * @returns Promise<boolean> True si la mise à jour a réussi
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
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la fonctionnalité:", error);
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: `Erreur lors de la mise à jour du statut de la fonctionnalité: ${error}`,
        context: "update_feature",
        timestamp: Date.now()
      });
      throw error;
    }
  }

  /**
   * Récupère le statut d'une fonctionnalité spécifique
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @returns Promise<boolean | null> Statut de la fonctionnalité ou null si non trouvée
   */
  async getFeatureStatus(moduleCode: string, featureCode: string): Promise<boolean | null> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('is_enabled')
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, feature not found
          return null;
        }
        throw error;
      }
      
      return data?.is_enabled || false;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la fonctionnalité ${moduleCode}.${featureCode}:`, error);
      throw error;
    }
  }

  /**
   * Get a feature by module code and feature code
   */
  async getFeatureByModuleAndCode(moduleCode: string, featureCode: string): Promise<any> {
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
      console.error('Error fetching feature:', error);
      return null;
    }
  }

  /**
   * Get all features for a specific module code
   */
  async getFeaturesByModuleCode(moduleCode: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*')
        .eq('module_code', moduleCode);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching features by module code:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const featureRepository = new FeatureRepository();
