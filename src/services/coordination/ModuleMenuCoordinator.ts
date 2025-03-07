
import { eventBus } from "@/core/event-bus/EventBus";
import { AppModule } from "@/hooks/modules/types";

// Événements de coordination du menu des modules
export const MODULE_MENU_EVENTS = {
  MENU_UPDATED: 'menu:updated',
  MODULE_STATUS_CHANGED: 'module:status-changed',
  ADMIN_ACCESS_GRANTED: 'admin:access-granted',
  ADMIN_ACCESS_REVOKED: 'admin:access-revoked'
};

// Codes de modules spéciaux
const ADMIN_MODULE_CODE = 'admin';
const CORE_MODULE_CODE = 'core';

/**
 * Coordinateur pour la gestion du menu des modules
 * Utilise le pattern Singleton pour assurer une instance unique
 */
class ModuleMenuCoordinator {
  private _isAdminAccess: boolean = false;
  
  // Notification de mise à jour du menu
  public notifyMenuUpdated() {
    eventBus.publish(MODULE_MENU_EVENTS.MENU_UPDATED, { timestamp: Date.now() });
  }
  
  // Notification de changement de statut d'un module
  public notifyModuleStatusChanged(moduleCode: string, status: string) {
    eventBus.publish(MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, { 
      moduleCode, 
      status,
      timestamp: Date.now() 
    });
  }
  
  // Vérifier si le module est visible dans le menu
  public isModuleVisibleInMenu(moduleCode: string, modules: AppModule[]): boolean {
    // Les modules spéciaux ont un traitement particulier
    if (moduleCode === ADMIN_MODULE_CODE) {
      return this._isAdminAccess;
    }
    
    if (moduleCode === CORE_MODULE_CODE) {
      return true;
    }
    
    // Cas d'un module normal: vérifier s'il est actif
    const module = modules.find(m => m.code === moduleCode);
    return module ? module.status === 'active' : false;
  }
  
  // Activer l'accès administrateur
  public enableAdminAccess() {
    if (!this._isAdminAccess) {
      this._isAdminAccess = true;
      eventBus.publish(MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, { timestamp: Date.now() });
      this.notifyMenuUpdated();
    }
  }
  
  // Désactiver l'accès administrateur
  public disableAdminAccess() {
    if (this._isAdminAccess) {
      this._isAdminAccess = false;
      eventBus.publish(MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, { timestamp: Date.now() });
      this.notifyMenuUpdated();
    }
  }
  
  // Vérifier si l'accès administrateur est activé
  public isAdminAccessEnabled(): boolean {
    return this._isAdminAccess;
  }
}

// Exporter une instance singleton
export const moduleMenuCoordinator = new ModuleMenuCoordinator();
