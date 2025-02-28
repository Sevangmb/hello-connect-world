
/**
 * Système de gestion des événements pour les modules
 * Ce fichier centralise les événements liés aux modules
 */

type ModuleStatusChangeCallback = () => void;
type FeatureStatusChangeCallback = () => void;

const MODULE_STATUS_CHANGED_EVENT = 'module_status_changed';
const FEATURE_STATUS_CHANGED_EVENT = 'feature_status_changed';

// Liste des abonnés aux événements de changement de statut des modules
const moduleStatusChangeListeners: ModuleStatusChangeCallback[] = [];
const featureStatusChangeListeners: FeatureStatusChangeCallback[] = [];

/**
 * Déclenche l'événement de changement de statut de module
 */
export const triggerModuleStatusChanged = () => {
  // Dispatcher l'événement DOM
  const event = new CustomEvent(MODULE_STATUS_CHANGED_EVENT);
  window.dispatchEvent(event);
  
  // Appeler tous les abonnés directs
  moduleStatusChangeListeners.forEach(listener => {
    try {
      listener();
    } catch (err) {
      console.error("Erreur lors de l'exécution d'un écouteur de changement de statut:", err);
    }
  });
};

/**
 * Déclenche l'événement de changement de statut de fonctionnalité
 */
export const triggerFeatureStatusChanged = () => {
  // Dispatcher l'événement DOM
  const event = new CustomEvent(FEATURE_STATUS_CHANGED_EVENT);
  window.dispatchEvent(event);
  
  // Appeler tous les abonnés directs
  featureStatusChangeListeners.forEach(listener => {
    try {
      listener();
    } catch (err) {
      console.error("Erreur lors de l'exécution d'un écouteur de changement de statut de fonctionnalité:", err);
    }
  });
};

/**
 * S'abonne aux changements de statut des modules
 * @param callback Fonction à appeler lorsque le statut d'un module change
 * @returns Fonction de nettoyage pour se désabonner
 */
export const onModuleStatusChanged = (callback: ModuleStatusChangeCallback): () => void => {
  // Ajouter l'écouteur à notre liste interne
  moduleStatusChangeListeners.push(callback);
  
  // Ajouter également un écouteur d'événement DOM pour les changements provenant d'autres tabs
  const handleDOMEvent = () => {
    callback();
  };
  
  window.addEventListener(MODULE_STATUS_CHANGED_EVENT, handleDOMEvent);
  
  // Retourner une fonction de nettoyage qui supprime les deux écouteurs
  return () => {
    const index = moduleStatusChangeListeners.indexOf(callback);
    if (index > -1) {
      moduleStatusChangeListeners.splice(index, 1);
    }
    window.removeEventListener(MODULE_STATUS_CHANGED_EVENT, handleDOMEvent);
  };
};

/**
 * S'abonne aux changements de statut des fonctionnalités
 * @param callback Fonction à appeler lorsque le statut d'une fonctionnalité change
 * @returns Fonction de nettoyage pour se désabonner
 */
export const onFeatureStatusChanged = (callback: FeatureStatusChangeCallback): () => void => {
  // Ajouter l'écouteur à notre liste interne
  featureStatusChangeListeners.push(callback);
  
  // Ajouter également un écouteur d'événement DOM pour les changements provenant d'autres tabs
  const handleDOMEvent = () => {
    callback();
  };
  
  window.addEventListener(FEATURE_STATUS_CHANGED_EVENT, handleDOMEvent);
  
  // Retourner une fonction de nettoyage qui supprime les deux écouteurs
  return () => {
    const index = featureStatusChangeListeners.indexOf(callback);
    if (index > -1) {
      featureStatusChangeListeners.splice(index, 1);
    }
    window.removeEventListener(FEATURE_STATUS_CHANGED_EVENT, handleDOMEvent);
  };
};

/**
 * Fonction d'écoute alias pour listenToModuleChanges (pour compatibilité avec ModuleStatusAlert)
 * @param callback Fonction à appeler lorsque le statut d'un module change
 * @returns Fonction de nettoyage pour se désabonner
 */
export const listenToModuleChanges = onModuleStatusChanged;
