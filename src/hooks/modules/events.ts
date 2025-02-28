
/**
 * Événements personnalisés liés aux modules et fonctionnalités
 */

// Types d'événements
export const MODULE_STATUS_CHANGED = 'module_status_changed';
export const FEATURE_STATUS_CHANGED = 'feature_status_changed';
export const APP_MODULES_UPDATED = 'app_modules_updated';

// Déclencher un événement de changement de statut de module
export const triggerModuleStatusChanged = (): void => {
  window.dispatchEvent(new CustomEvent(MODULE_STATUS_CHANGED));
};

// Déclencher un événement de changement de statut de fonctionnalité
export const triggerFeatureStatusChanged = (): void => {
  window.dispatchEvent(new CustomEvent(FEATURE_STATUS_CHANGED));
};

// Déclencher un événement de mise à jour des modules
export const triggerModulesUpdated = (): void => {
  window.dispatchEvent(new CustomEvent(APP_MODULES_UPDATED));
};

// Interface pour l'abonnement aux événements
export interface EventListeners {
  subscribe: () => void;
  unsubscribe: () => void;
}

// Créer un gestionnaire d'événements pour les modules
export const createModuleEventsListener = (callback: () => void): EventListeners => {
  const handleEvent = () => {
    callback();
  };
  
  return {
    subscribe: () => {
      window.addEventListener(MODULE_STATUS_CHANGED, handleEvent);
      window.addEventListener(APP_MODULES_UPDATED, handleEvent);
    },
    unsubscribe: () => {
      window.removeEventListener(MODULE_STATUS_CHANGED, handleEvent);
      window.removeEventListener(APP_MODULES_UPDATED, handleEvent);
    }
  };
};

// Créer un gestionnaire d'événements pour les fonctionnalités
export const createFeatureEventsListener = (callback: () => void): EventListeners => {
  const handleEvent = () => {
    callback();
  };
  
  return {
    subscribe: () => {
      window.addEventListener(FEATURE_STATUS_CHANGED, handleEvent);
    },
    unsubscribe: () => {
      window.removeEventListener(FEATURE_STATUS_CHANGED, handleEvent);
    }
  };
};
