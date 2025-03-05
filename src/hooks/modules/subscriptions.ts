
/**
 * Subscriptions pour les modules
 * Gère les abonnements aux événements liés aux modules
 */
import { MODULE_EVENTS } from '@/services/modules/ModuleEvents';
import { eventBus } from '@/core/event-bus/EventBus';
import { AppModule, ModuleDependency } from './types';

// Constantes pour les événements locaux
const LOCAL_EVENTS = {
  MODULES_UPDATED: 'local:modules_updated',
  DEPENDENCIES_UPDATED: 'local:dependencies_updated',
  FEATURES_UPDATED: 'local:features_updated'
};

/**
 * Type pour la fonction de désabonnement
 */
type UnsubscribeFunction = () => void;

/**
 * Adapte un module depuis la réponse Supabase pour ajouter les champs manquants
 */
export const adaptModuleFromResponse = (moduleFromDb: any): AppModule => {
  return {
    ...moduleFromDb,
    version: moduleFromDb.version || "1.0.0",
    is_admin: moduleFromDb.is_admin || false,
    priority: moduleFromDb.priority || 0
  } as AppModule;
};

/**
 * S'abonne aux mises à jour des modules
 */
export const subscribeToModuleUpdates = (
  setModules: React.Dispatch<React.SetStateAction<AppModule[]>>
): UnsubscribeFunction => {
  const handleModulesUpdate = (modules: AppModule[]) => {
    setModules(modules);
  };

  eventBus.subscribe(MODULE_EVENTS.MODULES_LOADED, handleModulesUpdate);
  eventBus.subscribe(LOCAL_EVENTS.MODULES_UPDATED, handleModulesUpdate);

  return () => {
    eventBus.unsubscribe(MODULE_EVENTS.MODULES_LOADED, handleModulesUpdate);
    eventBus.unsubscribe(LOCAL_EVENTS.MODULES_UPDATED, handleModulesUpdate);
  };
};

/**
 * Adapte une dépendance depuis la réponse Supabase pour ajouter les champs manquants
 */
export const adaptDependencyFromResponse = (dependencyFromDb: any): ModuleDependency => {
  return {
    ...dependencyFromDb,
    created_at: dependencyFromDb.created_at || new Date().toISOString(),
    updated_at: dependencyFromDb.updated_at || new Date().toISOString()
  } as ModuleDependency;
};

/**
 * S'abonne aux mises à jour des dépendances
 */
export const subscribeToDependencyUpdates = (
  setDependencies: React.Dispatch<React.SetStateAction<ModuleDependency[]>>
): UnsubscribeFunction => {
  const handleDependenciesUpdate = (dependencies: ModuleDependency[]) => {
    setDependencies(dependencies);
  };

  eventBus.subscribe(LOCAL_EVENTS.DEPENDENCIES_UPDATED, handleDependenciesUpdate);

  return () => {
    eventBus.unsubscribe(LOCAL_EVENTS.DEPENDENCIES_UPDATED, handleDependenciesUpdate);
  };
};

/**
 * Gère les abonnements et désabonnements pour les modules et dépendances
 */
export const setupSubscriptions = (
  setModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
  setDependencies: React.Dispatch<React.SetStateAction<ModuleDependency[]>>
): () => void => {
  const unsubscribeFromModules = subscribeToModuleUpdates(setModules);
  const unsubscribeFromDependencies = subscribeToDependencyUpdates(setDependencies);

  return () => {
    unsubscribeFromModules();
    unsubscribeFromDependencies();
  };
};
