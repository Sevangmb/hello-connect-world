
/**
 * Service central pour la gestion des modules de l'application
 * Agit comme une façade pour les autres services et maintient une représentation cohérente des modules
 */
import { AppModule, ModuleStatus } from "../types";
import * as moduleCacheService from "./ModuleCacheService";
import { moduleDbService } from "./ModuleDbService";
import { moduleValidator } from "./ModuleValidator";
import { ADMIN_MODULE_CODE } from "../constants";

// Événements liés aux modules
export const MODULE_EVENTS = {
  MODULES_UPDATED: 'modules_updated',
  MODULE_STATUS_CHANGED: 'module_status_changed',
  FEATURES_UPDATED: 'features_updated',
  LOADING_STATE_CHANGED: 'loading_state_changed',
  ERROR_OCCURRED: 'error_occurred'
};

class ModuleRegistry {
  private modules: AppModule[] = [];
  private dependencies: any[] = [];
  private features: Record<string, Record<string, boolean>> = {};
  private loading: boolean = true;
  private error: string | null = null;
  private lastRefreshTime: number = 0;
  private isInitialized: boolean = false;
  private refreshPromise: Promise<AppModule[]> | null = null;
  private listeners: Record<string, Array<() => void>> = {};

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Initialise le registre des modules
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      // Charger depuis le cache d'abord
      const cachedModules = moduleCacheService.getModulesFromCache();
      if (cachedModules && cachedModules.length > 0) {
        this.modules = cachedModules;
        this.emitEvent(MODULE_EVENTS.MODULES_UPDATED);
        this.setLoading(false);
      }

      // Puis rafraîchir depuis la base de données
      await this.refreshModules();
      await this.refreshDependencies();
      await this.refreshFeatures();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('ModuleRegistry: Erreur lors de l\'initialisation', error);
      this.setError('Erreur lors de l\'initialisation des modules');
      this.setLoading(false);
      return false;
    }
  }

  /**
   * Rafraîchit tous les modules depuis la base de données
   */
  async refreshModules(force: boolean = false): Promise<AppModule[]> {
    // Pour éviter les appels simultanés, on utilise une promesse partagée
    if (this.refreshPromise && !force) {
      return this.refreshPromise;
    }

    try {
      this.setLoading(true);
      
      // Création d'une nouvelle promesse pour ce rafraîchissement
      this.refreshPromise = (async () => {
        try {
          // Récupérer les modules depuis la base de données
          const freshModules = await moduleDbService.fetchAllModules();
          
          // Valider les modules avec leurs dépendances
          const validatedModules = moduleValidator.validateAllModules(freshModules, this.dependencies);
          
          // Mettre à jour l'état interne
          this.modules = validatedModules;
          this.lastRefreshTime = Date.now();
          
          // Mettre à jour le cache
          moduleCacheService.cacheModules(validatedModules);
          
          // Déclencher les événements
          this.emitEvent(MODULE_EVENTS.MODULES_UPDATED);
          
          return validatedModules;
        } catch (error) {
          console.error('ModuleRegistry: Erreur lors du rafraîchissement des modules', error);
          
          // En cas d'erreur, essayer d'utiliser le cache
          const cachedModules = moduleCacheService.getModulesFromCache();
          if (cachedModules && cachedModules.length > 0) {
            this.modules = cachedModules;
            this.emitEvent(MODULE_EVENTS.MODULES_UPDATED);
            return cachedModules;
          }
          
          this.setError('Erreur lors du chargement des modules');
          throw error;
        } finally {
          this.setLoading(false);
          // Réinitialiser la promesse partagée
          this.refreshPromise = null;
        }
      })();
      
      return this.refreshPromise;
    } catch (error) {
      this.setLoading(false);
      this.setError('Erreur lors du rafraîchissement des modules');
      console.error('ModuleRegistry: Exception lors du rafraîchissement des modules', error);
      return this.modules;
    }
  }

  /**
   * Rafraîchit toutes les dépendances depuis la base de données
   */
  async refreshDependencies(): Promise<any[]> {
    try {
      this.setLoading(true);
      
      // Récupérer les dépendances depuis la base de données
      const dependencies = await moduleDbService.fetchAllDependencies();
      
      // Mettre à jour l'état interne
      this.dependencies = dependencies;
      
      // Revalider les modules avec les nouvelles dépendances
      if (this.modules.length > 0) {
        this.modules = moduleValidator.validateAllModules(this.modules, dependencies);
        this.emitEvent(MODULE_EVENTS.MODULES_UPDATED);
      }
      
      return dependencies;
    } catch (error) {
      console.error('ModuleRegistry: Erreur lors du rafraîchissement des dépendances', error);
      this.setError('Erreur lors du chargement des dépendances');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Rafraîchit toutes les fonctionnalités depuis la base de données
   */
  async refreshFeatures(): Promise<Record<string, Record<string, boolean>>> {
    try {
      this.setLoading(true);
      
      // Récupérer les fonctionnalités depuis la base de données
      const features = await moduleDbService.fetchAllFeatures();
      
      // Mettre à jour l'état interne
      this.features = features;
      
      // Mettre à jour le cache
      moduleCacheService.cacheFeatures(features);
      
      // Déclencher les événements
      this.emitEvent(MODULE_EVENTS.FEATURES_UPDATED);
      
      return features;
    } catch (error) {
      console.error('ModuleRegistry: Erreur lors du rafraîchissement des fonctionnalités', error);
      
      // En cas d'erreur, essayer d'utiliser le cache
      const cachedFeatures = moduleCacheService.getFeaturesFromCache();
      if (cachedFeatures) {
        this.features = cachedFeatures;
        this.emitEvent(MODULE_EVENTS.FEATURES_UPDATED);
        return cachedFeatures;
      }
      
      this.setError('Erreur lors du chargement des fonctionnalités');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Met à jour le statut d'un module
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
    try {
      // Trouver le module concerné
      const moduleToUpdate = this.modules.find(m => m.id === moduleId);
      if (!moduleToUpdate) {
        console.error(`ModuleRegistry: Module avec ID ${moduleId} non trouvé`);
        return false;
      }
      
      // Vérifier si c'est un module admin ou core
      if (moduleToUpdate.code === ADMIN_MODULE_CODE || 
          moduleToUpdate.code.startsWith('admin_') ||
          moduleToUpdate.is_core) {
        if (status !== 'active') {
          console.error(`ModuleRegistry: Impossible de désactiver le module admin/core ${moduleToUpdate.code}`);
          return false;
        }
      }
      
      // Vérifier si le module peut être désactivé
      if (status !== 'active' && 
          !moduleValidator.canDeactivateModule(
            moduleId, 
            moduleToUpdate.code, 
            moduleToUpdate.is_core, 
            this.dependencies
          )) {
        return false;
      }
      
      // Vérifier si le module peut être activé
      if (status === 'active' && 
          !moduleValidator.canActivateModule(
            moduleId, 
            moduleToUpdate.code, 
            this.dependencies
          )) {
        return false;
      }
      
      // Mettre à jour en base de données
      const success = await moduleDbService.updateModuleStatus(moduleId, status);
      
      if (success) {
        // Mettre à jour localement
        this.modules = this.modules.map(m => 
          m.id === moduleId ? { ...m, status } : m
        );
        
        // Invalider le cache
        moduleCacheService.clearCache();
        
        // Rafraîchir toutes les données pour prendre en compte les impacts sur les dépendances
        await this.refreshModules(true);
        
        // Déclencher les événements
        this.emitEvent(MODULE_EVENTS.MODULE_STATUS_CHANGED);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('ModuleRegistry: Erreur lors de la mise à jour du statut du module', error);
      this.setError('Erreur lors de la mise à jour du statut du module');
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
      // Vérifier si c'est une fonctionnalité admin
      if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
        if (!isEnabled) {
          console.error(`ModuleRegistry: Impossible de désactiver la fonctionnalité admin ${moduleCode}.${featureCode}`);
          return false;
        }
      }
      
      // Mettre à jour en base de données
      const success = await moduleDbService.updateFeatureStatus(moduleCode, featureCode, isEnabled);
      
      if (success) {
        // Mettre à jour localement
        if (!this.features[moduleCode]) {
          this.features[moduleCode] = {};
        }
        this.features[moduleCode][featureCode] = isEnabled;
        
        // Invalider le cache
        moduleCacheService.clearCache();
        
        // Rafraîchir toutes les fonctionnalités
        await this.refreshFeatures();
        
        // Déclencher les événements
        this.emitEvent(MODULE_EVENTS.FEATURES_UPDATED);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('ModuleRegistry: Erreur lors de la mise à jour de la fonctionnalité', error);
      this.setError('Erreur lors de la mise à jour de la fonctionnalité');
      return false;
    }
  }

  /**
   * Vérifie si un module est actif
   */
  isModuleActive(moduleCode: string): boolean {
    // Module admin toujours actif
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return true;
    }
    
    // Vérifier d'abord dans le cache
    const cachedStatus = moduleCacheService.getModuleStatus(moduleCode);
    if (cachedStatus !== null) {
      return cachedStatus === 'active';
    }
    
    // Sinon chercher dans les modules locaux
    const module = this.modules.find(m => m.code === moduleCode);
    return module ? module.status === 'active' : false;
  }

  /**
   * Vérifie si un module est en mode dégradé
   */
  isModuleDegraded(moduleCode: string): boolean {
    // Module admin jamais dégradé
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return false;
    }
    
    // Vérifier dans les modules locaux
    const module = this.modules.find(m => m.code === moduleCode);
    return module ? module.status === 'degraded' : false;
  }

  /**
   * Vérifie si une fonctionnalité est activée
   */
  isFeatureEnabled(moduleCode: string, featureCode: string): boolean {
    // Si le module n'est pas actif, la fonctionnalité n'est pas disponible
    if (!this.isModuleActive(moduleCode)) {
      return false;
    }
    
    // Fonctionnalités admin toujours activées
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return true;
    }
    
    // Vérifier dans les fonctionnalités locales
    if (this.features[moduleCode] && this.features[moduleCode][featureCode] !== undefined) {
      return this.features[moduleCode][featureCode];
    }
    
    // Par défaut, considérer comme désactivée
    return false;
  }

  /**
   * Définit l'état de chargement et émet un événement
   */
  private setLoading(loading: boolean): void {
    if (this.loading !== loading) {
      this.loading = loading;
      this.emitEvent(MODULE_EVENTS.LOADING_STATE_CHANGED);
    }
  }

  /**
   * Définit l'erreur et émet un événement
   */
  private setError(error: string | null): void {
    this.error = error;
    if (error) {
      this.emitEvent(MODULE_EVENTS.ERROR_OCCURRED);
    }
  }

  /**
   * Émet un événement à tous les écouteurs
   */
  private emitEvent(eventName: string): void {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(listener => listener());
    }
    
    // Émettre également un événement DOM pour la synchronisation entre onglets
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName));
    }
  }

  /**
   * Configure les écouteurs d'événements
   */
  private setupEventListeners(): void {
    if (typeof window !== 'undefined') {
      // Écouter les événements de mise à jour du cache
      window.addEventListener('modules_cache_updated', () => {
        const cachedModules = moduleCacheService.getModulesFromCache();
        if (cachedModules && cachedModules.length > 0) {
          this.modules = cachedModules;
          this.emitEvent(MODULE_EVENTS.MODULES_UPDATED);
        }
      });
      
      // Écouter les événements de mise à jour des fonctionnalités
      window.addEventListener('features_cache_updated', () => {
        const cachedFeatures = moduleCacheService.getFeaturesFromCache();
        if (cachedFeatures) {
          this.features = cachedFeatures;
          this.emitEvent(MODULE_EVENTS.FEATURES_UPDATED);
        }
      });
      
      // Écouter les événements de rafraîchissement en arrière-plan
      window.addEventListener('background_refresh_needed', () => {
        // Rafraîchir sans bloquer l'UI
        this.refreshModules(false).catch(console.error);
      });
      
      // Écouter les changements de statut dans d'autres onglets
      window.addEventListener('module_status_changed', () => {
        // Rafraîchir sans bloquer l'UI
        this.refreshModules(true).catch(console.error);
      });
    }
  }

  /**
   * Ajoute un écouteur d'événement
   */
  addListener(eventName: string, listener: () => void): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    
    this.listeners[eventName].push(listener);
    
    // Retourner une fonction pour supprimer l'écouteur
    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(l => l !== listener);
    };
  }

  /**
   * Accesseurs
   */
  getModules(): AppModule[] {
    return this.modules;
  }

  getDependencies(): any[] {
    return this.dependencies;
  }

  getFeatures(): Record<string, Record<string, boolean>> {
    return this.features;
  }

  isLoading(): boolean {
    return this.loading;
  }

  getError(): string | null {
    return this.error;
  }

  getLastRefreshTime(): number {
    return this.lastRefreshTime;
  }

  getInitialized(): boolean {
    return this.isInitialized;
  }
}

// Créer et exporter une instance unique pour toute l'application
export const moduleRegistry = new ModuleRegistry();
