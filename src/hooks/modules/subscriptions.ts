import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_EVENTS } from "@/services/modules/ModuleEvents";
import { AppModule, ModuleDependency } from "./types";

/**
 * Gestion des abonnements aux événements liés aux modules
 */

/**
 * S'abonne aux événements de chargement des modules
 * @param callback Fonction appelée lorsque les modules sont chargés
 * @returns Fonction pour se désabonner
 */
export const subscribeToModulesLoaded = (callback: (modules: AppModule[]) => void) => {
  return eventBus.subscribe(MODULE_EVENTS.MODULES_LOADED, callback);
};

/**
 * S'abonne aux événements de chargement des dépendances
 * @param callback Fonction appelée lorsque les dépendances sont chargées
 * @returns Fonction pour se désabonner
 */
export const subscribeToDependenciesLoaded = (callback: (dependencies: ModuleDependency[]) => void) => {
  return eventBus.subscribe(MODULE_EVENTS.DEPENDENCIES_UPDATED, callback);
};

/**
 * S'abonne aux événements de changement de statut des modules
 * @param callback Fonction appelée lorsque le statut d'un module change
 * @returns Fonction pour se désabonner
 */
export const subscribeToModuleStatusChanged = (callback: (data: any) => void) => {
  return eventBus.subscribe(MODULE_EVENTS.MODULE_STATUS_CHANGED, callback);
};

/**
 * S'abonne à tous les événements liés aux modules
 * @returns Fonction pour se désabonner de tous les événements
 */
export const subscribeToModuleEvents = () => {
  const unsubModules = eventBus.subscribe(MODULE_EVENTS.MODULES_LOADED, (modules) => {
    // Handler for module loading
    console.log('Modules loaded:', modules);
  });
  
  const unsubDependencies = eventBus.subscribe(MODULE_EVENTS.DEPENDENCIES_UPDATED, (dependencies) => {
    // Handler for dependency updates
    console.log('Dependencies updated:', dependencies);
  });
  
  // Return function to unsubscribe from all events
  return () => {
    unsubModules();
    unsubDependencies();
  };
};

/**
 * S'abonne aux événements d'erreur liés aux modules
 * @param callback Fonction appelée lorsqu'une erreur survient
 * @returns Fonction pour se désabonner
 */
export const subscribeToModuleErrors = (callback: (error: any) => void) => {
  return eventBus.subscribe(MODULE_EVENTS.MODULE_ERROR, callback);
};

/**
 * S'abonne aux événements d'initialisation des modules
 * @param onStarted Fonction appelée lorsque l'initialisation commence
 * @param onCompleted Fonction appelée lorsque l'initialisation est terminée
 * @returns Fonction pour se désabonner
 */
export const subscribeToModuleInitialization = (
  onStarted: () => void,
  onCompleted: () => void
) => {
  const startedUnsub = eventBus.subscribe(MODULE_EVENTS.MODULES_INITIALIZATION_STARTED, onStarted);
  const completedUnsub = eventBus.subscribe(MODULE_EVENTS.MODULES_INITIALIZATION_COMPLETED, onCompleted);
  
  return () => {
    startedUnsub();
    completedUnsub();
  };
};
