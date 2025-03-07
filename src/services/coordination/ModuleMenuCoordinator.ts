
import { eventBus } from "@/core/event-bus/EventBus";
import { getModuleActiveStatus } from "@/hooks/modules/hooks/status";
import { AppModule } from "@/hooks/modules/types";
import { ADMIN_MODULE_CODE } from "@/hooks/modules/constants";

export const MODULE_MENU_EVENTS = {
  MENU_UPDATED: 'module_menu:menu_updated',
  MODULE_STATUS_CHANGED: 'module_menu:module_status_changed',
  ADMIN_ACCESS_GRANTED: 'module_menu:admin_access_granted',
  ADMIN_ACCESS_REVOKED: 'module_menu:admin_access_revoked',
  NAVIGATION_REQUESTED: 'module_menu:navigation_requested'
};

export class ModuleMenuCoordinator {
  private static instance: ModuleMenuCoordinator;
  private adminAccessEnabled: boolean = false;
  private moduleCache: Record<string, boolean> = {};
  private lastRefreshTimestamp: number = 0;
  private debounceTimers: Record<string, NodeJS.Timeout> = {};
  private DEBOUNCE_DELAY = 300; // ms

  private constructor() {
    this.setupEventListeners();
    this.initializeFromLocalStorage();
  }

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

  public static getInstance(): ModuleMenuCoordinator {
    if (!ModuleMenuCoordinator.instance) {
      ModuleMenuCoordinator.instance = new ModuleMenuCoordinator();
    }
    return ModuleMenuCoordinator.instance;
  }

  private setupEventListeners(): void {
    eventBus.subscribe('modules:status_changed', (data) => {
      console.log('ModuleMenuCoordinator: modules:status_changed reçu pour', data.moduleCode);
      this.debounceEvent('module_status', () => {
        this.onModuleStatusChanged(data.moduleCode, data.status);
      });
    });

    eventBus.subscribe('module:status_updated', (data) => {
      console.log('ModuleMenuCoordinator: module:status_updated reçu pour', data.moduleId, data.status);
      
      this.clearModuleCache();
      
      this.debounceEvent('module_status_hook', () => {
        eventBus.publish(MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, {
          moduleCode: data.moduleCode || 'unknown',
          status: data.status,
          timestamp: Date.now()
        });
      });
    });

    eventBus.subscribe('users:admin_status_changed', (data) => {
      this.debounceEvent('admin_status', () => {
        this.onAdminStatusChanged(data.userId, data.isAdmin);
      });
    });
  }

  private debounceEvent(key: string, callback: () => void): void {
    if (this.debounceTimers[key]) {
      clearTimeout(this.debounceTimers[key]);
    }
    
    this.debounceTimers[key] = setTimeout(() => {
      callback();
      delete this.debounceTimers[key];
    }, this.DEBOUNCE_DELAY);
  }

  public isModuleVisibleInMenu(moduleCode: string, modules: AppModule[]): boolean {
    // Toujours autoriser le module d'administration pour les administrateurs
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return this.adminAccessEnabled;
    }

    // Vérifier le cache pour une performance optimale
    if (this.moduleCache[moduleCode] !== undefined) {
      return this.moduleCache[moduleCode];
    }

    // Vérifier le statut du module
    const isActive = getModuleActiveStatus(moduleCode, modules);
    
    // Mettre en cache le résultat
    this.moduleCache[moduleCode] = isActive;
    console.log(`ModuleMenuCoordinator: Module ${moduleCode} visibilité: ${isActive}`);
    
    return isActive;
  }

  private onModuleStatusChanged(moduleCode: string, status: string): void {
    console.log(`ModuleMenuCoordinator: Changement de statut du module ${moduleCode} à ${status}`);
    
    // Invalider le cache pour ce module
    delete this.moduleCache[moduleCode];
    this.moduleCache[moduleCode] = status === 'active';
    
    // Publier l'événement de changement de statut
    this.debounceEvent('module_status_changed', () => {
      eventBus.publish(MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, {
        moduleCode,
        status,
        timestamp: Date.now()
      });
      console.log(`ModuleMenuCoordinator: Module ${moduleCode} status changed to ${status}`);
    });
    
    // Rafraîchir le menu
    this.refreshMenu();
  }

  private onAdminStatusChanged(userId: string, isAdmin: boolean): void {
    if (isAdmin) {
      this.enableAdminAccess();
    } else {
      this.disableAdminAccess();
    }
  }

  // Fonction publique pour demander une navigation
  public requestNavigation(path: string): void {
    console.log(`ModuleMenuCoordinator: Demande de navigation vers ${path}`);
    
    eventBus.publish(MODULE_MENU_EVENTS.NAVIGATION_REQUESTED, {
      path,
      timestamp: Date.now()
    });
  }

  public refreshMenu(): void {
    const now = Date.now();
    
    // Limiter la fréquence des rafraîchissements
    if (now - this.lastRefreshTimestamp < 500) {
      return;
    }
    
    this.lastRefreshTimestamp = now;
    
    this.debounceEvent('menu_refresh', () => {
      eventBus.publish(MODULE_MENU_EVENTS.MENU_UPDATED, {
        timestamp: now
      });
    });
  }

  public clearModuleCache(): void {
    console.log('ModuleMenuCoordinator: Nettoyage du cache des modules');
    this.moduleCache = {};
    this.refreshMenu();
  }

  public enableAdminAccess(): void {
    if (this.adminAccessEnabled) return;
    
    this.adminAccessEnabled = true;
    
    try {
      localStorage.setItem('admin_access_enabled', 'true');
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du statut admin:', e);
    }
    
    this.debounceEvent('admin_granted', () => {
      eventBus.publish(MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, {
        timestamp: Date.now()
      });
      console.log('ModuleMenuCoordinator: Admin access enabled');
    });
    
    // Rafraîchir le menu après avoir activé l'accès admin
    this.refreshMenu();
  }

  public disableAdminAccess(): void {
    if (!this.adminAccessEnabled) return;
    
    this.adminAccessEnabled = false;
    
    try {
      localStorage.removeItem('admin_access_enabled');
    } catch (e) {
      console.error('Erreur lors de la suppression du statut admin:', e);
    }
    
    this.debounceEvent('admin_revoked', () => {
      eventBus.publish(MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, {
        timestamp: Date.now()
      });
      console.log('ModuleMenuCoordinator: Admin access disabled');
    });
    
    // Rafraîchir le menu après avoir désactivé l'accès admin
    this.refreshMenu();
  }
}

export const moduleMenuCoordinator = ModuleMenuCoordinator.getInstance();
