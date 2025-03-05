/**
 * Service pour gérer les modules - Implémentation concrète
 * Couche Application de la Clean Architecture
 */
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { ModuleRepository, moduleRepository } from '../repositories/ModuleRepository';
import { IModuleService } from './IModuleService';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '../ModuleEvents';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_MODULE_CODE } from '@/hooks/modules/constants';

export class ModuleServiceImpl implements IModuleService {
  private repository: ModuleRepository;
  
  constructor(repository: ModuleRepository) {
    this.repository = repository;
  }
  
  /**
   * Récupère tous les modules
   */
  async getAllModules(): Promise<AppModule[]> {
    try {
      const modules = await this.repository.fetchAllModules();
      eventBus.publish(MODULE_EVENTS.MODULES_LOADED, { 
        count: modules.length,
        timestamp: Date.now()
      });
      return modules;
    } catch (error) {
      console.error("Erreur lors du chargement des modules:", error);
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, { 
        error,
        context: "getAllModules", 
        timestamp: Date.now()
      });
      return [];
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
      // Vérifier si c'est le module Admin
      const module = await this.repository.getModuleByCode(ADMIN_MODULE_CODE);
      if (module && module.id === moduleId && status !== 'active') {
        console.error("Le module Admin ne peut pas être désactivé");
        return false;
      }
      
      const success = await this.repository.updateModuleStatus(moduleId, status);
      
      if (success) {
        eventBus.publish(MODULE_EVENTS.MODULE_STATUS_CHANGED, {
          moduleId,
          status,
          timestamp: Date.now()
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du module:", error);
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, { 
        error,
        context: "updateModuleStatus",
        moduleId,
        status,
        timestamp: Date.now()
      });
      return false;
    }
  }
  
  /**
   * Enregistre l'utilisation d'un module
   * @param moduleCode Code du module
   */
  async recordModuleUsage(moduleCode: string): Promise<void> {
    try {
      if (!moduleCode) return;
      
      // Utiliser la fonction RPC pour incrémenter l'utilisation du module
      const { error } = await supabase.rpc('increment_module_usage', { module_code: moduleCode });
      
      if (error) throw error;
      
      eventBus.publish(MODULE_EVENTS.MODULE_USAGE_RECORDED, {
        moduleCode,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de l'utilisation du module ${moduleCode}:`, error);
    }
  }
  
  /**
   * Vérifie si un module est actif
   * @param moduleCode Code du module
   * @returns Promise<boolean> True si le module est actif
   */
  async isModuleActive(moduleCode: string): Promise<boolean> {
    try {
      // Si c'est le module Admin, toujours retourner true
      if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
        return true;
      }
      
      // Utiliser la fonction RPC pour vérifier si le module est actif
      const { data, error } = await supabase.rpc('is_module_active', { module_code: moduleCode });
      
      if (error) throw error;
      
      return !!data;
    } catch (error) {
      console.error(`Erreur lors de la v��rification du statut du module ${moduleCode}:`, error);
      
      // Fallback: vérifier directement dans la table
      try {
        const module = await this.repository.getModuleByCode(moduleCode);
        return module?.status === 'active';
      } catch (fallbackError) {
        console.error(`Erreur lors de la vérification du fallback pour ${moduleCode}:`, fallbackError);
        return false;
      }
    }
  }
}

// Exporter une instance unique pour toute l'application
export const moduleService = new ModuleServiceImpl(moduleRepository);
