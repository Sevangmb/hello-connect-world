
/**
 * Hook React pour interagir avec l'Event Bus
 * Facilite l'utilisation de l'Event Bus dans les composants React
 */
import { useEffect, useCallback, useRef } from 'react';
import { eventBus, EventCallback, UnsubscribeFunction } from '@/core/event-bus/EventBus';

/**
 * Hook pour s'abonner à un événement du Event Bus
 * @param eventName Nom de l'événement
 * @param callback Fonction de callback
 * @param deps Dépendances pour useEffect
 */
export function useEventSubscription<T = any>(
  eventName: string,
  callback: EventCallback<T>,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(eventName, callback);
    
    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, [eventName, ...deps]);
}

/**
 * Hook pour s'abonner à plusieurs événements du Event Bus
 * @param events Tableau de noms d'événements
 * @param callback Fonction de callback
 * @param deps Dépendances pour useEffect
 */
export function useMultiEventSubscription(
  events: string[],
  callback: EventCallback,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    const unsubscribeFunctions = events.map(eventName => 
      eventBus.subscribe(eventName, callback)
    );
    
    // Nettoyer tous les abonnements lors du démontage
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [JSON.stringify(events), ...deps]);
}

/**
 * Hook pour s'abonner à un pattern d'événements du Event Bus
 * @param pattern Expression régulière pour les noms d'événements
 * @param callback Fonction de callback
 * @param deps Dépendances pour useEffect
 */
export function usePatternSubscription(
  pattern: RegExp,
  callback: EventCallback,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    const unsubscribe = eventBus.subscribeToPattern(pattern, callback);
    
    // Nettoyer l'abonnement lors du démontage
    return () => {
      unsubscribe();
    };
  }, [pattern.toString(), ...deps]);
}

/**
 * Hook pour publier des événements sur le Event Bus
 * @returns Fonction pour publier des événements
 */
export function useEventPublisher(): {
  publish: <T = any>(eventName: string, data: T) => void;
} {
  return {
    publish: useCallback(<T = any>(eventName: string, data: T) => {
      eventBus.publish(eventName, data);
    }, [])
  };
}

/**
 * Hook pour s'abonner aux événements globaux du Event Bus (cross-tab)
 * @param eventName Nom de l'événement
 * @param callback Fonction de callback
 * @param deps Dépendances pour useEffect
 */
export function useGlobalEventSubscription<T = any>(
  eventName: string,
  callback: EventCallback<T>,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    const unsubscribe = eventBus.subscribeToGlobal(eventName, callback);
    
    // Nettoyer l'abonnement lors du démontage
    return () => {
      unsubscribe();
    };
  }, [eventName, ...deps]);
}

/**
 * Hook pour consommer l'historique des événements
 * @param eventName Nom de l'événement
 * @returns Historique des événements
 */
export function useEventHistory<T = any>(eventName: string): T[] {
  return eventBus.getHistory(eventName);
}

/**
 * Export du hook principal qui regroupe toutes les fonctionnalités
 */
export function useEventBus() {
  return {
    subscribe: useCallback((eventName: string, callback: EventCallback) => {
      return eventBus.subscribe(eventName, callback);
    }, []),
    
    publish: useCallback((eventName: string, data: any) => {
      eventBus.publish(eventName, data);
    }, []),
    
    getHistory: useCallback((eventName: string) => {
      return eventBus.getHistory(eventName);
    }, []),
    
    clear: useCallback((eventName?: string) => {
      eventBus.clear(eventName);
    }, [])
  };
}
