
/**
 * Système de gestion des événements pour les modules
 * Ce fichier centralise les événements liés aux modules
 */

type ModuleStatusChangeCallback = () => void;

const MODULE_STATUS_CHANGED_EVENT = 'module_status_changed';

// Liste des abonnés aux événements de changement de statut des modules
const moduleStatusChangeListeners: ModuleStatusChangeCallback[] = [];

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
