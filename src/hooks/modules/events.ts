
/**
 * Système de gestion des événements pour les modules
 * Ce fichier utilise le service d'événements centralisé au lieu d'une implémentation séparée
 */
import { eventService } from '@/services/events/EventService';

// Événements du module
const MODULE_STATUS_CHANGED_EVENT = 'module_status_changed';
const FEATURE_STATUS_CHANGED_EVENT = 'feature_status_changed';

/**
 * Déclenche l'événement de changement de statut de module
 */
export const triggerModuleStatusChanged = () => {
  console.log("[ModuleEvents] Déclenchement de l'événement de changement de statut de module");
  eventService.publish(MODULE_STATUS_CHANGED_EVENT, {
    timestamp: Date.now()
  });
};

/**
 * Déclenche l'événement de changement de statut de fonctionnalité
 */
export const triggerFeatureStatusChanged = () => {
  console.log("[ModuleEvents] Déclenchement de l'événement de changement de statut de fonctionnalité");
  eventService.publish(FEATURE_STATUS_CHANGED_EVENT, {
    timestamp: Date.now()
  });
};

/**
 * S'abonne aux changements de statut des modules
 * @param callback Fonction à appeler lorsque le statut d'un module change
 * @returns Fonction de nettoyage pour se désabonner
 */
export const onModuleStatusChanged = (callback: () => void): () => void => {
  console.log("[ModuleEvents] Abonnement aux changements de statut des modules");
  return eventService.subscribe(MODULE_STATUS_CHANGED_EVENT, callback);
};

/**
 * S'abonne aux changements de statut des fonctionnalités
 * @param callback Fonction à appeler lorsque le statut d'une fonctionnalité change
 * @returns Fonction de nettoyage pour se désabonner
 */
export const onFeatureStatusChanged = (callback: () => void): () => void => {
  console.log("[ModuleEvents] Abonnement aux changements de statut des fonctionnalités");
  return eventService.subscribe(FEATURE_STATUS_CHANGED_EVENT, callback);
};

/**
 * Fonction d'écoute alias pour listenToModuleChanges (pour compatibilité avec ModuleStatusAlert)
 * @param callback Fonction à appeler lorsque le statut d'un module change
 * @returns Fonction de nettoyage pour se désabonner
 */
export const listenToModuleChanges = onModuleStatusChanged;
