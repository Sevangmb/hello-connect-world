
/**
 * Cas d'utilisation pour la gestion des statuts de modules
 * Centralise la logique métier liée aux statuts
 */
import { AppModule, ModuleStatus } from '@/hooks/modules/types';
import { moduleRepository } from '../repositories/ModuleRepository';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from '../ModuleEvents';

export class ModuleStatusUseCase {
  // Cache pour les vérifications répétées
  private moduleStatusCache: Record<string, { status: ModuleStatus, timestamp: number }> = {};
  private CACHE_VALIDITY_MS = 30000; // 30 secondes

  constructor() {}

  /**
   * Met à jour le statut d'un module et gère les événements liés
   * @param moduleId ID du module
   * @param status Nouveau statut
   * @param currentModule Module actuel (optionnel)
   * @returns Promise<boolean> True si la mise à jour a réussi
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus, currentModule?: AppModule): Promise<boolean> {
    try {
      // Trouver le module actuel si non fourni
      let moduleToUpdate = currentModule;
      if (!moduleToUpdate) {
        const modules = await moduleRepository.fetchAllModules();
        moduleToUpdate = modules.find(m => m.id === moduleId);
        if (!moduleToUpdate) {
          throw new Error(`Module avec l'ID ${moduleId} non trouvé`);
        }
      }
      
      const oldStatus = moduleToUpdate.status;
      
      // Mettre à jour dans la base de données
      const success = await moduleRepository.updateModuleStatus(moduleId, status);
      
      if (success) {
        // Mettre à jour le cache
        this.moduleStatusCache[moduleToUpdate.code] = {
          status,
          timestamp: Date.now()
        };
        
        // Publier un événement de changement de statut
        eventBus.publish(MODULE_EVENTS.MODULE_STATUS_CHANGED, {
          moduleId,
          moduleCode: moduleToUpdate.code,
          oldStatus,
          newStatus: status,
          timestamp: Date.now()
        });
        
        // Publier un événement spécifique selon le nouveau statut
        if (status === 'active') {
          eventBus.publish(MODULE_EVENTS.MODULE_ACTIVATED, {
            moduleId,
            moduleCode: moduleToUpdate.code,
            timestamp: Date.now()
          });
        } else if (status === 'inactive') {
          eventBus.publish(MODULE_EVENTS.MODULE_DEACTIVATED, {
            moduleId,
            moduleCode: moduleToUpdate.code,
            timestamp: Date.now()
          });
        } else if (status === 'degraded') {
          eventBus.publish(MODULE_EVENTS.MODULE_DEGRADED, {
            moduleId,
            moduleCode: moduleToUpdate.code,
            timestamp: Date.now()
          });
        }
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du module:", error);
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: `Erreur lors de la mise à jour du statut du module: ${error}`,
        context: "update_status",
        timestamp: Date.now()
      });
      return false;
    }
  }

  /**
   * Vérifie si un module est actif
   * @param moduleCode Code du module
   * @param modules Liste des modules (optionnelle)
   * @returns boolean True si le module est actif
   */
  isModuleActive(moduleCode: string, modules?: AppModule[]): boolean {
    // Administrateur toujours actif
    if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
      return true;
    }
    
    // Vérifier le cache (validité: 30 secondes)
    const cached = this.moduleStatusCache[moduleCode];
    if (cached && (Date.now() - cached.timestamp < this.CACHE_VALIDITY_MS)) {
      return cached.status === 'active';
    }
    
    // Sinon, vérifier dans la liste des modules
    if (modules && modules.length > 0) {
      const module = modules.find(m => m.code === moduleCode);
      if (module) {
        // Mettre à jour le cache
        this.moduleStatusCache[moduleCode] = {
          status: module.status,
          timestamp: Date.now()
        };
        return module.status === 'active';
      }
    }
    
    return false;
  }

  /**
   * Vérifie si un module est en mode dégradé
   * @param moduleCode Code du module
   * @param modules Liste des modules (optionnelle)
   * @returns boolean True si le module est en mode dégradé
   */
  isModuleDegraded(moduleCode: string, modules?: AppModule[]): boolean {
    // Administrateur jamais en mode dégradé
    if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
      return false;
    }
    
    // Vérifier le cache (validité: 30 secondes)
    const cached = this.moduleStatusCache[moduleCode];
    if (cached && (Date.now() - cached.timestamp < this.CACHE_VALIDITY_MS)) {
      return cached.status === 'degraded';
    }
    
    // Sinon, vérifier dans la liste des modules
    if (modules && modules.length > 0) {
      const module = modules.find(m => m.code === moduleCode);
      if (module) {
        // Mettre à jour le cache
        this.moduleStatusCache[moduleCode] = {
          status: module.status,
          timestamp: Date.now()
        };
        return module.status === 'degraded';
      }
    }
    
    return false;
  }

  /**
   * Met à jour le cache des statuts de modules
   * @param modules Liste des modules à mettre en cache
   */
  updateStatusCache(modules: AppModule[]): void {
    modules.forEach(module => {
      this.moduleStatusCache[module.code] = {
        status: module.status,
        timestamp: Date.now()
      };
    });
  }
}

// Exporter une instance unique pour toute l'application
export const moduleStatusUseCase = new ModuleStatusUseCase();
