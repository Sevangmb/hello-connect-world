
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
    subscribeToMultiple: eventService.subscribeToMultiple.bind(eventService),
    subscribeToPattern: eventService.subscribeToPattern.bind(eventService),
    EVENT_TYPES
  };
};
