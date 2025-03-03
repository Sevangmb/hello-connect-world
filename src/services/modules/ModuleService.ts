/**
 * Service central pour la gestion des modules
 * Implémente l'API de communication avec les modules
 */
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from './ModuleEvents';
import { 
  AppModule, 
  ModuleStatus 
} from '@/hooks/modules/types';
import { 
  refreshModulesWithCache, 
  refreshModulesWithRetry 
} from '@/hooks/modules/utils/moduleRefresh';
import { moduleValidator } from '@/hooks/modules/services/ModuleValidator';
import { moduleCacheService } from '@/hooks/modules/services/ModuleCacheService';
import { supabase } from '@/integrations/supabase/client';

class ModuleService {
  private modules: AppModule[] = [];
  private dependencies: any[] = [];
  private features: Record<string, Record<string, boolean>> = {};
  private initialized: boolean = false;
  private moduleStatusCache: Record<string, { status: ModuleStatus, timestamp: number }> = {};

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
      // Utiliser refreshModulesWithRetry qui possède une logique de backoff exponentiel
      const setModulesFn = (modules: AppModule[]) => {
        this.modules = modules;
      };
      
      const updatedModules = await refreshModulesWithRetry(setModulesFn);
      
      // Mettre à jour le cache pour chaque module
      updatedModules.forEach(module => {
        this.moduleStatusCache[module.code] = {
          status: module.status,
          timestamp: Date.now()
        };
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
      
      this.dependencies = data || [];
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
      const { data, error } = await supabase
        .from('module_features')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Organiser les fonctionnalités par module
      const featuresData: Record<string, Record<string, boolean>> = {};
      data.forEach(feature => {
        if (!featuresData[feature.module_code]) {
          featuresData[feature.module_code] = {};
        }
        featuresData[feature.module_code][feature.feature_code] = feature.is_enabled;
      });
      
      this.features = featuresData;
      return featuresData;
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
   * @returns True si la mise à jour a réussi
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      // Trouver le module actuel pour pouvoir émettre un événement avec l'ancien statut
      const currentModule = this.modules.find(m => m.id === moduleId);
      if (!currentModule) {
        throw new Error(`Module avec l'ID ${moduleId} non trouvé`);
      }
      
      const oldStatus = currentModule.status;
      
      // Faire la mise à jour dans la base de données
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
      
      // Mettre à jour localement
      const moduleIndex = this.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        this.modules[moduleIndex].status = status;
        
        // Mettre à jour le cache
        this.moduleStatusCache[currentModule.code] = {
          status,
          timestamp: Date.now()
        };
      }
      
      // Publier un événement de changement de statut
      eventBus.publish(MODULE_EVENTS.MODULE_STATUS_CHANGED, {
        moduleId,
        moduleCode: currentModule.code,
        oldStatus,
        newStatus: status,
        timestamp: Date.now()
      });
      
      // Publier un événement spécifique selon le nouveau statut
      if (status === 'active') {
        eventBus.publish(MODULE_EVENTS.MODULE_ACTIVATED, {
          moduleId,
          moduleCode: currentModule.code,
          timestamp: Date.now()
        });
      } else if (status === 'inactive') {
        eventBus.publish(MODULE_EVENTS.MODULE_DEACTIVATED, {
          moduleId,
          moduleCode: currentModule.code,
          timestamp: Date.now()
        });
      } else if (status === 'degraded') {
        eventBus.publish(MODULE_EVENTS.MODULE_DEGRADED, {
          moduleId,
          moduleCode: currentModule.code,
          timestamp: Date.now()
        });
      }
      
      return true;
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
   * @param isEnabled Statut d'activation
   * @returns True si la mise à jour a réussi
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
      
      // Mettre à jour localement
      if (!this.features[moduleCode]) {
        this.features[moduleCode] = {};
      }
      this.features[moduleCode][featureCode] = isEnabled;
      
      // Publier un événement de changement de statut de fonctionnalité
      eventBus.publish(MODULE_EVENTS.FEATURE_STATUS_CHANGED, {
        moduleCode,
        featureCode,
        isEnabled,
        timestamp: Date.now()
      });
      
      // Publier un événement spécifique selon le nouveau statut
      if (isEnabled) {
        eventBus.publish(MODULE_EVENTS.FEATURE_ACTIVATED, {
          moduleCode,
          featureCode,
          timestamp: Date.now()
        });
      } else {
        eventBus.publish(MODULE_EVENTS.FEATURE_DEACTIVATED, {
          moduleCode,
          featureCode,
          timestamp: Date.now()
        });
      }
      
      return true;
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
    // Administrateur toujours actif
    if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
      return true;
    }
    
    // Vérifier le cache (validité: 30 secondes)
    const cached = this.moduleStatusCache[moduleCode];
    if (cached && (Date.now() - cached.timestamp < 30000)) {
      return cached.status === 'active';
    }
    
    // Sinon, vérifier dans la liste des modules
    const module = this.modules.find(m => m.code === moduleCode);
    if (module) {
      // Mettre à jour le cache
      this.moduleStatusCache[moduleCode] = {
        status: module.status,
        timestamp: Date.now()
      };
      return module.status === 'active';
    }
    
    return false;
  }

  /**
   * Vérifie si un module est en mode dégradé
   * @param moduleCode Code du module
   * @returns True si le module est en mode dégradé
   */
  isModuleDegraded(moduleCode: string): boolean {
    // Vérifier le cache (validité: 30 secondes)
    const cached = this.moduleStatusCache[moduleCode];
    if (cached && (Date.now() - cached.timestamp < 30000)) {
      return cached.status === 'degraded';
    }
    
    // Sinon, vérifier dans la liste des modules
    const module = this.modules.find(m => m.code === moduleCode);
    if (module) {
      // Mettre à jour le cache
      this.moduleStatusCache[moduleCode] = {
        status: module.status,
        timestamp: Date.now()
      };
      return module.status === 'degraded';
    }
    
    return false;
  }

  /**
   * Vérifie si une fonctionnalité est activée
   * @param moduleCode Code du module
   * @param featureCode Code de la fonctionnalité
   * @returns True si la fonctionnalité est activée
   */
  isFeatureEnabled(moduleCode: string, featureCode: string): boolean {
    return this.features[moduleCode]?.[featureCode] === true;
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
