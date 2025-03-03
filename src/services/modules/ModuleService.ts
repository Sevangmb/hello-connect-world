
/**
 * Service principal pour la gestion des modules
 * Implémente une API claire et cohérente avec communication via Event Bus
 */
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_EVENTS, ModuleStatusChangedEvent, FeatureStatusChangedEvent, ModuleErrorEvent } from "./ModuleEvents";
import { AppModule, ModuleStatus } from "@/hooks/modules/types";
import { moduleRegistry } from "@/hooks/modules/services/ModuleRegistry";
import { circuitBreakerService } from "@/hooks/modules/services/CircuitBreakerService";
import { moduleCacheService } from "@/hooks/modules/services/ModuleCacheService";
import { moduleDbService } from "@/hooks/modules/services/ModuleDbService";

class ModuleService {
  private initialized = false;
  private initPromise: Promise<boolean> | null = null;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Initialise le service de modules
   * Cette méthode doit être appelée au démarrage de l'application
   */
  async initialize(): Promise<boolean> {
    // Éviter les initialisations multiples
    if (this.initialized) {
      return true;
    }

    // Utiliser une promesse partagée pour éviter les multiples appels
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        console.log("ModuleService: Initialisation du service de modules");
        
        // Initialiser le registre de modules
        await moduleRegistry.initialize();
        
        // Récupérer les données initiales depuis la base de données
        await this.refreshModules(true);
        
        // Marquer comme initialisé
        this.initialized = true;
        
        // Publier l'événement d'initialisation
        eventBus.publish(MODULE_EVENTS.MODULES_INITIALIZED, {
          timestamp: Date.now(),
          source: 'init'
        });
        
        console.log("ModuleService: Service de modules initialisé avec succès");
        return true;
      } catch (error) {
        console.error("ModuleService: Erreur lors de l'initialisation", error);
        
        // Publier l'événement d'erreur
        this.publishError("Erreur lors de l'initialisation du service de modules", "initialization");
        
        // Essayer de récupérer depuis le cache
        try {
          const cachedModules = moduleCacheService.getModulesFromCache();
          if (cachedModules && cachedModules.length > 0) {
            console.log(`ModuleService: Utilisation de ${cachedModules.length} modules du cache après échec d'initialisation`);
            return true;
          }
        } catch (e) {
          console.error("ModuleService: Erreur lors de la récupération depuis le cache", e);
        }
        
        return false;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  /**
   * Rafraîchit tous les modules depuis la base de données
   * @param force Force le rafraîchissement même si les données sont récentes
   */
  async refreshModules(force: boolean = false): Promise<AppModule[]> {
    try {
      console.log(`ModuleService: Rafraîchissement des modules (force=${force})`);
      
      // Utiliser le circuit breaker pour éviter les appels répétés en cas d'erreur
      const modules = await circuitBreakerService.execute('modules_refresh', async () => {
        return moduleDbService.fetchAllModules();
      });
      
      // Publier l'événement de rafraîchissement
      eventBus.publish(MODULE_EVENTS.MODULES_REFRESHED, {
        count: modules.length,
        timestamp: Date.now(),
        source: 'api'
      });
      
      return modules;
    } catch (error) {
      console.error("ModuleService: Erreur lors du rafraîchissement des modules", error);
      
      // Publier l'événement d'erreur
      this.publishError("Erreur lors du rafraîchissement des modules", "refresh");
      
      // Essayer de récupérer depuis le cache
      try {
        const cachedModules = moduleCacheService.getModulesFromCache();
        if (cachedModules && cachedModules.length > 0) {
          console.log(`ModuleService: Utilisation de ${cachedModules.length} modules du cache après échec de rafraîchissement`);
          return cachedModules;
        }
      } catch (e) {
        console.error("ModuleService: Erreur lors de la récupération depuis le cache", e);
      }
      
      return [];
    }
  }

  /**
   * Rafraîchit toutes les fonctionnalités depuis la base de données
   */
  async refreshFeatures(): Promise<Record<string, Record<string, boolean>>> {
    try {
      console.log("ModuleService: Rafraîchissement des fonctionnalités");
      
      // Utiliser le circuit breaker pour éviter les appels répétés en cas d'erreur
      return await circuitBreakerService.execute('features_refresh', async () => {
        return moduleDbService.fetchAllFeatures();
      });
    } catch (error) {
      console.error("ModuleService: Erreur lors du rafraîchissement des fonctionnalités", error);
      
      // Publier l'événement d'erreur
      this.publishError("Erreur lors du rafraîchissement des fonctionnalités", "features");
      
      // Essayer de récupérer depuis le cache
      const cachedFeatures = moduleCacheService.getFeaturesFromCache();
      if (cachedFeatures) {
        return cachedFeatures;
      }
      
      return {};
    }
  }

  /**
   * Met à jour le statut d'un module
   * @param moduleId ID du module
   * @param status Nouveau statut
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      console.log(`ModuleService: Mise à jour du statut du module ${moduleId} à ${status}`);
      
      // Récupérer l'ancien statut pour l'événement
      const module = moduleRegistry.getModules().find(m => m.id === moduleId);
      const oldStatus = module?.status || 'unknown';
      
      // Mettre à jour le statut via le registre
      const success = await moduleRegistry.updateModuleStatus(moduleId, status);
      
      if (success && module) {
        // Publier l'événement de changement de statut
        this.publishStatusChange(moduleId, module.code, oldStatus, status);
        
        // Publier également un événement spécifique selon le nouveau statut
        if (status === 'active') {
          eventBus.publish(MODULE_EVENTS.MODULE_ACTIVATED, {
            moduleId,
            moduleCode: module.code,
            timestamp: Date.now()
          });
        } else if (status === 'degraded') {
          eventBus.publish(MODULE_EVENTS.MODULE_DEGRADED, {
            moduleId,
            moduleCode: module.code,
            timestamp: Date.now()
          });
        } else if (status === 'inactive') {
          eventBus.publish(MODULE_EVENTS.MODULE_DEACTIVATED, {
            moduleId,
            moduleCode: module.code,
            timestamp: Date.now()
          });
        }
      }
      
      return success;
    } catch (error) {
      console.error(`ModuleService: Erreur lors de la mise à jour du statut du module ${moduleId}`, error);
      
      // Publier l'événement d'erreur
      this.publishError(`Erreur lors de la mise à jour du statut du module ${moduleId}`, "status_update");
      
      return false;
    }
  }

  /**
   * Met à jour le statut d'une fonctionnalité
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @param isEnabled Nouvel état
   */
  async updateFeatureStatus(
    moduleCode: string,
    featureCode: string,
    isEnabled: boolean
  ): Promise<boolean> {
    try {
      console.log(`ModuleService: Mise à jour de la fonctionnalité ${moduleCode}.${featureCode} à ${isEnabled}`);
      
      // Mettre à jour la fonctionnalité via le registre
      const success = await moduleRegistry.updateFeatureStatus(moduleCode, featureCode, isEnabled);
      
      if (success) {
        // Publier l'événement de changement de statut de fonctionnalité
        const event: FeatureStatusChangedEvent = {
          moduleCode,
          featureCode,
          isEnabled,
          timestamp: Date.now()
        };
        
        eventBus.publish(MODULE_EVENTS.FEATURE_STATUS_CHANGED, event);
        
        // Publier également un événement spécifique selon le nouveau statut
        if (isEnabled) {
          eventBus.publish(MODULE_EVENTS.FEATURE_ACTIVATED, event);
        } else {
          eventBus.publish(MODULE_EVENTS.FEATURE_DEACTIVATED, event);
        }
      }
      
      return success;
    } catch (error) {
      console.error(`ModuleService: Erreur lors de la mise à jour de la fonctionnalité ${moduleCode}.${featureCode}`, error);
      
      // Publier l'événement d'erreur
      this.publishError(`Erreur lors de la mise à jour de la fonctionnalité ${moduleCode}.${featureCode}`, "feature_update");
      
      return false;
    }
  }

  /**
   * Vérifie si un module est actif
   * @param moduleCode Code du module
   */
  isModuleActive(moduleCode: string): boolean {
    return moduleRegistry.isModuleActive(moduleCode);
  }

  /**
   * Vérifie si un module est en mode dégradé
   * @param moduleCode Code du module
   */
  isModuleDegraded(moduleCode: string): boolean {
    return moduleRegistry.isModuleDegraded(moduleCode);
  }

  /**
   * Vérifie si une fonctionnalité est activée
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   */
  isFeatureEnabled(moduleCode: string, featureCode: string): boolean {
    return moduleRegistry.isFeatureEnabled(moduleCode, featureCode);
  }

  /**
   * Récupère tous les modules
   */
  getModules(): AppModule[] {
    return moduleRegistry.getModules();
  }

  /**
   * Récupère toutes les fonctionnalités
   */
  getFeatures(): Record<string, Record<string, boolean>> {
    return moduleRegistry.getFeatures();
  }

  /**
   * Récupère toutes les dépendances
   */
  getDependencies(): any[] {
    return moduleRegistry.getDependencies();
  }

  /**
   * Publie un événement de changement de statut
   */
  private publishStatusChange(
    moduleId: string,
    moduleCode: string,
    oldStatus: string,
    newStatus: string
  ): void {
    const event: ModuleStatusChangedEvent = {
      moduleId,
      moduleCode,
      oldStatus,
      newStatus,
      timestamp: Date.now()
    };
    
    eventBus.publish(MODULE_EVENTS.MODULE_STATUS_CHANGED, event);
  }

  /**
   * Publie un événement d'erreur
   */
  private publishError(error: string, context: string): void {
    const event: ModuleErrorEvent = {
      error,
      context,
      timestamp: Date.now()
    };
    
    eventBus.publish(MODULE_EVENTS.MODULE_ERROR, event);
  }

  /**
   * Configure les écouteurs d'événements
   */
  private setupEventListeners(): void {
    // Écouter les événements de synchronisation
    eventBus.subscribe(MODULE_EVENTS.MODULES_SYNC_REQUESTED, () => {
      this.refreshModules(true).catch(console.error);
    });
    
    // Écouter les événements DOM pour la synchronisation entre onglets
    if (typeof window !== 'undefined') {
      eventBus.subscribeToGlobal(MODULE_EVENTS.MODULE_STATUS_CHANGED, () => {
        this.refreshModules(true).catch(console.error);
      });
      
      eventBus.subscribeToGlobal(MODULE_EVENTS.FEATURE_STATUS_CHANGED, () => {
        this.refreshFeatures().catch(console.error);
      });
    }
  }
}

// Exporter une instance unique pour toute l'application
export const moduleService = new ModuleService();
