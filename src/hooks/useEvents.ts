
/**
 * Hook pour l'utilisation du bus d'événements
 * Fournit une interface React-friendly pour s'abonner et publier des événements
 */
import { useEffect, useCallback, useRef } from 'react';
import { eventService, EVENT_TYPES } from '@/services/events/EventService';
import type { EventCallback } from '@/core/event-bus/EventBus';

export const useEvents = () => {
  const subscriptionsRef = useRef<(() => void)[]>([]);

  // Fonction pour s'abonner à un événement avec nettoyage automatique
  const subscribe = useCallback(<T = any>(
    eventName: string, 
    callback: EventCallback<T>
  ) => {
    const unsubscribe = eventService.subscribe(eventName, callback);
    subscriptionsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  // Fonction pour publier un événement
  const publish = useCallback(<T = any>(
    eventName: string, 
    data?: T
  ) => {
    eventService.publish(eventName, data);
  }, []);
  
  // Fonction pour s'abonner à plusieurs événements à la fois
  const subscribeToMultipleEvents = useCallback(<T = any>(
    eventNames: string[],
    callback: EventCallback<T>
  ) => {
    const unsubscribe = eventService.subscribeToMultiple(eventNames, callback);
    subscriptionsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);
  
  // Fonction pour s'abonner à des événements selon un pattern
  const subscribeToPatternEvents = useCallback(<T = any>(
    pattern: RegExp,
    callback: EventCallback<T>
  ) => {
    const unsubscribe = eventService.subscribeToPattern(pattern, callback);
    subscriptionsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  // Nettoyage automatique des abonnements au démontage du composant
  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach(unsubscribe => unsubscribe());
      subscriptionsRef.current = [];
    };
  }, []);

  // Retourne les fonctions utilitaires et les types d'événements
  return {
    subscribe,
    publish,
    subscribeToMultiple: subscribeToMultipleEvents,
    subscribeToPattern: subscribeToPatternEvents,
    EVENT_TYPES
  };
};
