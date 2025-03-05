/**
 * Repository pour l'accès aux données des dépendances de modules
 */
import { supabase } from '@/integrations/supabase/client';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '../ModuleEvents';

export class DependencyRepository {
  /**
   * Récupère toutes les dépendances entre modules
   * @returns Promise<any[]> Liste des dépendances
   */
  async fetchAllDependencies(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('module_dependencies')
        .select(`
          module_id,
          module_code,
          module_name,
          module_status,
          dependency_id,
          dependency_code,
          dependency_name,
          dependency_status,
          is_required
        `);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Erreur lors du chargement des dépendances:", error);
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: "Erreur lors du chargement des dépendances",
        context: "dependencies",
        timestamp: Date.now()
      });
      throw error;
    }
  }

  async getModuleDependencies(moduleId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('module_dependencies_view')
      .select('*')
      .eq('module_id', moduleId);

    if (error) {
      console.error('Error fetching module dependencies:', error);
      return [];
    }

    return data;
  }
}

// Exporter une instance unique pour toute l'application
export const dependencyRepository = new DependencyRepository();
