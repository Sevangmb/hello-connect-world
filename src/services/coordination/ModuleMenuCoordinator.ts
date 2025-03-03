
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

  private constructor() {
    // Initialiser les écouteurs d'événements
    this.setupEventListeners();
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
      this.onModuleStatusChanged(data.moduleCode, data.status);
    });

    // Écouter les changements de statut admin
    eventBus.subscribe('users:admin_status_changed', (data) => {
      this.onAdminStatusChanged(data.userId, data.isAdmin);
    });
  }

  /**
   * Déterminer si un module doit être visible dans le menu
   */
  public isModuleVisibleInMenu(moduleCode: string, modules: AppModule[]): boolean {
    // Les modules admin sont toujours visibles pour les administrateurs
    if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin_')) {
      return this.adminAccessEnabled;
    }

    // Pour les autres modules, vérifier s'ils sont actifs
    return getModuleActiveStatus(moduleCode, modules);
  }

  /**
   * Accorder l'accès admin aux menus
   */
  public enableAdminAccess(): void {
    this.adminAccessEnabled = true;
    
    // Notifier les composants abonnés
    eventBus.publish(MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, {
      timestamp: Date.now()
    });
    
    console.log('ModuleMenuCoordinator: Admin access enabled');
  }

  /**
   * Révoquer l'accès admin aux menus
   */
  public disableAdminAccess(): void {
    this.adminAccessEnabled = false;
    
    // Notifier les composants abonnés
    eventBus.publish(MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, {
      timestamp: Date.now()
    });
    
    console.log('ModuleMenuCoordinator: Admin access disabled');
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
    // Mettre à jour le cache
    this.moduleCache[moduleCode] = status === 'active';
    
    // Notifier les abonnés
    eventBus.publish(MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, {
      moduleCode,
      status,
      timestamp: Date.now()
    });
    
    console.log(`ModuleMenuCoordinator: Module ${moduleCode} status changed to ${status}`);
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
   * Forcer un rafraîchissement du menu
   */
  public refreshMenu(): void {
    eventBus.publish(MODULE_MENU_EVENTS.MENU_UPDATED, {
      timestamp: Date.now()
    });
  }
}

// Exporter une instance singleton pour un accès facile
export const moduleMenuCoordinator = ModuleMenuCoordinator.getInstance();
