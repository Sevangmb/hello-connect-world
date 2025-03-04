
import { eventBus } from "@/core/event-bus/EventBus";
import { getModuleActiveStatus } from "@/hooks/modules/hooks/status";
import { AppModule } from "@/hooks/modules/types";
import { ADMIN_MODULE_CODE } from "@/hooks/modules/constants";

// Types d'événements pour la coordination
export const MODULE_MENU_EVENTS = {
  MENU_UPDATED: 'module_menu:menu_updated',
  MODULE_STATUS_CHANGED: 'module_menu:module_status_changed',
  ADMIN_ACCESS_GRANTED: 'module_menu:admin_access_granted',
  ADMIN_ACCESS_REVOKED: 'module_menu:admin_access_revoked'
};

/**
 * Classe de coordination entre les modules et le menu
 * Implémente le pattern Mediator pour découpler les deux systèmes
 */
export class ModuleMenuCoordinator {
  private static instance: ModuleMenuCoordinator;
  private adminAccessEnabled: boolean = false;
  private moduleCache: Record<string, boolean> = {};
  private lastRefreshTimestamp: number = 0;
  private debounceTimers: Record<string, NodeJS.Timeout> = {};
  private DEBOUNCE_DELAY = 300; // ms

  private constructor() {
    // Initialiser les écouteurs d'événements
    this.setupEventListeners();
    
    // Initialiser avec les valeurs du localStorage
    this.initializeFromLocalStorage();
  }
  
  /**
   * Initialiser à partir des données existantes
   */
  private initializeFromLocalStorage(): void {
    try {
      const adminAccess = localStorage.getItem('admin_access_enabled');
      if (adminAccess === 'true') {
        this.adminAccessEnabled = true;
        console.log('ModuleMenuCoordinator: Admin access initialized from storage');
      }
    } catch (e) {
      console.error('Erreur lors de l\'initialisation du coordinateur:', e);
    }
  }

  /**
   * Obtenir l'instance singleton
   */
  public static getInstance(): ModuleMenuCoordinator {
    if (!ModuleMenuCoordinator.instance) {
      ModuleMenuCoordinator.instance = new ModuleMenuCoordinator();
    }
    return ModuleMenuCoordinator.instance;
  }

  /**
   * Mise en place des écouteurs d'événements
   */
  private setupEventListeners(): void {
    // Écouter les changements de statut des modules
    eventBus.subscribe('modules:status_changed', (data) => {
      this.debounceEvent('module_status', () => {
        this.onModuleStatusChanged(data.moduleCode, data.status);
      });
    });

    // Écouter les changements de statut admin
    eventBus.subscribe('users:admin_status_changed', (data) => {
      this.debounceEvent('admin_status', () => {
        this.onAdminStatusChanged(data.userId, data.isAdmin);
      });
    });
  }
  
  /**
   * Debouncer pour éviter trop d'événements rapprochés
   */
  private debounceEvent(key: string, callback: () => void): void {
    // Annuler tout timer existant
    if (this.debounceTimers[key]) {
      clearTimeout(this.debounceTimers[key]);
    }
    
    // Créer un nouveau timer
    this.debounceTimers[key] = setTimeout(() => {
      callback();
      delete this.debounceTimers[key];
    }, this.DEBOUNCE_DELAY);
  }

  /**
   * Déterminer si un module doit être visible dans le menu
   */
  public isModuleVisibleInMenu(moduleCode: string, modules: AppModule[]): boolean {
    // Les modules admin sont toujours visibles pour les administrateurs
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return this.adminAccessEnabled;
    }

    // Cache pour éviter des calculs redondants
    if (this.moduleCache[moduleCode] !== undefined) {
      return this.moduleCache[moduleCode];
    }

    // Pour les autres modules, vérifier s'ils sont actifs
    const isActive = getModuleActiveStatus(moduleCode, modules);
    
    // Mettre en cache pour les appels futurs
    this.moduleCache[moduleCode] = isActive;
    
    return isActive;
  }

  /**
   * Accorder l'accès admin aux menus
   */
  public enableAdminAccess(): void {
    if (this.adminAccessEnabled) return; // Éviter les événements inutiles
    
    this.adminAccessEnabled = true;
    
    // Persister l'état
    try {
      localStorage.setItem('admin_access_enabled', 'true');
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du statut admin:', e);
    }
    
    // Notifier les composants abonnés avec debounce
    this.debounceEvent('admin_granted', () => {
      eventBus.publish(MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, {
        timestamp: Date.now()
      });
      console.log('ModuleMenuCoordinator: Admin access enabled');
    });
  }

  /**
   * Révoquer l'accès admin aux menus
   */
  public disableAdminAccess(): void {
    if (!this.adminAccessEnabled) return; // Éviter les événements inutiles
    
    this.adminAccessEnabled = false;
    
    // Persister l'état
    try {
      localStorage.removeItem('admin_access_enabled');
    } catch (e) {
      console.error('Erreur lors de la suppression du statut admin:', e);
    }
    
    // Notifier les composants abonnés avec debounce
    this.debounceEvent('admin_revoked', () => {
      eventBus.publish(MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, {
        timestamp: Date.now()
      });
      console.log('ModuleMenuCoordinator: Admin access disabled');
    });
  }

  /**
   * Vérifier si l'accès admin est activé
   */
  public isAdminAccessEnabled(): boolean {
    return this.adminAccessEnabled;
  }

  /**
   * Gérer les changements de statut des modules
   */
  private onModuleStatusChanged(moduleCode: string, status: string): void {
    // Nettoyer le cache pour ce module
    delete this.moduleCache[moduleCode];
    
    // Mettre à jour le cache avec la nouvelle valeur
    this.moduleCache[moduleCode] = status === 'active';
    
    // Notifier les abonnés
    this.debounceEvent('module_status_changed', () => {
      eventBus.publish(MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, {
        moduleCode,
        status,
        timestamp: Date.now()
      });
      console.log(`ModuleMenuCoordinator: Module ${moduleCode} status changed to ${status}`);
    });
  }

  /**
   * Gérer les changements de statut admin
   */
  private onAdminStatusChanged(userId: string, isAdmin: boolean): void {
    if (isAdmin) {
      this.enableAdminAccess();
    } else {
      this.disableAdminAccess();
    }
  }

  /**
   * Forcer un rafraîchissement du menu avec limitation de fréquence
   */
  public refreshMenu(): void {
    const now = Date.now();
    
    // Limiter la fréquence des rafraîchissements
    if (now - this.lastRefreshTimestamp < 500) {
      return; // Ignorer les rafraîchissements trop fréquents
    }
    
    this.lastRefreshTimestamp = now;
    
    // Utiliser le debounce pour éviter les rafraîchissements multiples
    this.debounceEvent('menu_refresh', () => {
      eventBus.publish(MODULE_MENU_EVENTS.MENU_UPDATED, {
        timestamp: now
      });
    });
  }
  
  /**
   * Nettoyer le cache des modules
   */
  public clearModuleCache(): void {
    this.moduleCache = {};
  }
}

// Exporter une instance singleton pour un accès facile
export const moduleMenuCoordinator = ModuleMenuCoordinator.getInstance();
