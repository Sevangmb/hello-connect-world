
/**
 * Service central pour la gestion des modules
 * Implémente l'API de communication avec les modules
 */
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from './ModuleEvents';
import { AppModule, ModuleStatus } from '@/hooks/modules/types';

// Importation des repositories
import { moduleRepository } from './repositories/ModuleRepository';
import { dependencyRepository } from './repositories/DependencyRepository';
import { featureRepository } from './repositories/FeatureRepository';

// Importation des cas d'utilisation
import { moduleStatusUseCase } from './usecases/ModuleStatusUseCase';
import { featureStatusUseCase } from './usecases/FeatureStatusUseCase';

// Importation des services utilitaires
import { moduleCacheService } from './cache/ModuleCacheService';
import { circuitBreakerService } from './utils/CircuitBreakerService';

class ModuleService {
  private modules: AppModule[] = [];
  private dependencies: any[] = [];
  private features: Record<string, Record<string, boolean>> = {};
  private initialized: boolean = false;

  /**
   * Initialise le service de modules
   * @returns True si l'initialisation a réussi
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    try {
      // Tenter de charger depuis le cache d'abord
      const cachedModules = moduleCacheService.getModulesFromCache();
      if (cachedModules && cachedModules.length > 0) {
        this.modules = cachedModules;
        
        // Publier un événement d'initialisation
        eventBus.publish(MODULE_EVENTS.MODULES_INITIALIZED, {
          count: cachedModules.length,
          timestamp: Date.now(),
          source: 'cache'
        });
      }
      
      // Charger les dépendances et fonctionnalités
      await this.refreshDependencies();
      await this.refreshFeatures();
      
      // Essayer de rafraîchir depuis l'API en arrière-plan
      this.refreshModules(false).catch(err => {
        console.error("Erreur lors du rafraîchissement des modules:", err);
        
        // Publier un événement d'erreur
        eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
          error: "Erreur lors du rafraîchissement des modules",
          context: "init",
          timestamp: Date.now()
        });
      });
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation du service de modules:", error);
      
      // Publier un événement d'erreur
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: "Erreur lors de l'initialisation du service de modules",
        context: "init",
        timestamp: Date.now()
      });
      
      return false;
    }
  }

  /**
   * Rafraîchit les modules depuis l'API
   * @param force Force le rafraîchissement même si des données existent déjà
   * @returns Liste des modules mis à jour
   */
  async refreshModules(force: boolean = false): Promise<AppModule[]> {
    // Si pas forcé et des modules existent déjà, retourner les modules existants
    if (!force && this.modules.length > 0) {
      return this.modules;
    }
    
    try {
      // Utiliser le circuit breaker pour éviter les appels répétés en cas d'erreur
      const updatedModules = await circuitBreakerService.execute('modules_refresh', async () => {
        const modules = await moduleRepository.fetchAllModules();
        
        // Mettre à jour l'état interne
        this.modules = modules;
        
        // Mettre à jour le cache
        moduleCacheService.cacheModules(modules);
        
        // Mettre à jour le cache de statuts
        moduleStatusUseCase.updateStatusCache(modules);
        
        // Publier un événement de rafraîchissement
        eventBus.publish(MODULE_EVENTS.MODULES_REFRESHED, {
          count: modules.length,
          timestamp: Date.now(),
          source: 'api'
        });
        
        return modules;
      });
      
      return updatedModules;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des modules:", error);
      throw error;
    }
  }

  /**
   * Rafraîchit les dépendances des modules
   * @returns Liste des dépendances mises à jour
   */
  async refreshDependencies(): Promise<any[]> {
    try {
      this.dependencies = await dependencyRepository.fetchAllDependencies();
      return this.dependencies;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des dépendances:", error);
      
      // Publier un événement d'erreur
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: "Erreur lors du rafraîchissement des dépendances",
        context: "dependencies",
        timestamp: Date.now()
      });
      
      return [];
    }
  }

  /**
   * Rafraîchit les fonctionnalités des modules
   * @returns Liste des fonctionnalités mises à jour
   */
  async refreshFeatures(): Promise<Record<string, Record<string, boolean>>> {
    try {
      this.features = await featureRepository.fetchAllFeatures();
      
      // Mettre à jour le cache de fonctionnalités
      featureStatusUseCase.updateFeatureCache(this.features);
      
      return this.features;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des fonctionnalités:", error);
      
      // Publier un événement d'erreur
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: "Erreur lors du rafraîchissement des fonctionnalités",
        context: "features",
        timestamp: Date.now()
      });
      
      return {};
    }
  }

  /**
   * Met à jour le statut d'un module
   * @param moduleId Identifiant du module
   * @param status Nouveau statut
   * @returns Promise<boolean> True si la mise à jour a réussi
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      // Trouver le module actuel
      const currentModule = this.modules.find(m => m.id === moduleId);
      if (!currentModule) {
        throw new Error(`Module avec l'ID ${moduleId} non trouvé`);
      }
      
      // Utiliser le cas d'utilisation pour gérer la mise à jour
      const success = await moduleStatusUseCase.updateModuleStatus(moduleId, status, currentModule);
      
      // Si succès, mettre à jour localement
      if (success) {
        const moduleIndex = this.modules.findIndex(m => m.id === moduleId);
        if (moduleIndex !== -1) {
          this.modules[moduleIndex].status = status;
        }
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du module:", error);
      
      // Publier un événement d'erreur
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: `Erreur lors de la mise à jour du statut du module: ${error}`,
        context: "update_status",
        timestamp: Date.now()
      });
      
      return false;
    }
  }

  /**
   * Met à jour le statut d'une fonctionnalité
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @param isEnabled Nouveau statut
   * @returns Promise<boolean> True si la mise à jour a réussi
   */
  async updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
    try {
      // Utiliser le cas d'utilisation pour gérer la mise à jour
      const success = await featureStatusUseCase.updateFeatureStatus(moduleCode, featureCode, isEnabled);
      
      // Si succès, mettre à jour localement
      if (success) {
        if (!this.features[moduleCode]) {
          this.features[moduleCode] = {};
        }
        this.features[moduleCode][featureCode] = isEnabled;
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la fonctionnalité:", error);
      
      // Publier un événement d'erreur
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: `Erreur lors de la mise à jour du statut de la fonctionnalité: ${error}`,
        context: "update_feature",
        timestamp: Date.now()
      });
      
      return false;
    }
  }

  /**
   * Vérifie si un module est actif
   * @param moduleCode Code du module
   * @returns True si le module est actif
   */
  isModuleActive(moduleCode: string): boolean {
    return moduleStatusUseCase.isModuleActive(moduleCode, this.modules);
  }

  /**
   * Vérifie si un module est en mode dégradé
   * @param moduleCode Code du module
   * @returns True si le module est en mode dégradé
   */
  isModuleDegraded(moduleCode: string): boolean {
    return moduleStatusUseCase.isModuleDegraded(moduleCode, this.modules);
  }

  /**
   * Vérifie si une fonctionnalité est activée
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @returns True si la fonctionnalité est activée
   */
  isFeatureEnabled(moduleCode: string, featureCode: string): boolean {
    return featureStatusUseCase.isFeatureEnabled(moduleCode, featureCode, this.features);
  }

  /**
   * Récupère la liste des modules
   * @returns Liste des modules
   */
  getModules(): AppModule[] {
    return this.modules;
  }

  /**
   * Récupère la liste des dépendances
   * @returns Liste des dépendances
   */
  getDependencies(): any[] {
    return this.dependencies;
  }

  /**
   * Récupère la liste des fonctionnalités
   * @returns Liste des fonctionnalités
   */
  getFeatures(): Record<string, Record<string, boolean>> {
    return this.features;
  }
}

// Exporter une instance unique pour toute l'application
export const moduleService = new ModuleService();
