
/**
 * Repository pour l'accès aux données des modules
 * Gère toutes les interactions avec Supabase pour les modules
 */
import { supabase } from '@/integrations/supabase/client';
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '../ModuleEvents';

export class ModuleRepository {
  /**
   * Récupère tous les modules depuis Supabase
   * @returns Promise<AppModule[]> Liste des modules
   */
  async fetchAllModules(): Promise<AppModule[]> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      // Assurer que les statuts sont valides et que tous les champs requis sont présents
      return (data || []).map(module => {
        const status = module.status as ModuleStatus;
        if (status !== 'active' && status !== 'inactive' && status !== 'degraded' && status !== 'maintenance') {
          console.warn(`Invalid module status "${module.status}" for module ${module.code}, defaulting to "inactive"`);
          return {
            ...module,
            status: 'inactive' as ModuleStatus,
            version: module.version || "1.0.0",
            is_admin: module.is_admin || false,
            priority: module.priority || 0
          };
        }
        return {
          ...module,
          version: module.version || "1.0.0",
          is_admin: module.is_admin || false,
          priority: module.priority || 0
        } as AppModule;
      });
    } catch (error) {
      console.error("Erreur lors du chargement des modules:", error);
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: "Erreur lors du chargement des modules",
        context: "fetch",
        timestamp: Date.now()
      });
      throw error;
    }
  }

  /**
   * Met à jour le statut d'un module
   * @param moduleId ID du module
   * @param status Nouveau statut
   * @returns Promise<boolean> True si la mise à jour a réussi
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_modules')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', moduleId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du module:", error);
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: `Erreur lors de la mise à jour du statut du module: ${error}`,
        context: "update_status",
        timestamp: Date.now()
      });
      throw error;
    }
  }

  /**
   * Récupère un module par son code
   * @param moduleCode Code du module
   * @returns Promise<AppModule | null> Module ou null si non trouvé
   */
  async getModuleByCode(moduleCode: string): Promise<AppModule | null> {
    try {
      const { data, error } = await supabase
        .from('app_modules')
        .select('*')
        .eq('code', moduleCode)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, module not found
          return null;
        }
        throw error;
      }
      
      return {
        ...data,
        version: data.version || "1.0.0",
        is_admin: data.is_admin || false,
        priority: data.priority || 0
      } as AppModule;
    } catch (error) {
      console.error(`Erreur lors de la récupération du module ${moduleCode}:`, error);
      throw error;
    }
  }
}

// Exporter une instance unique pour toute l'application
export const moduleRepository = new ModuleRepository();
