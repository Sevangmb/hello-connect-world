
/**
 * Service centralisé pour la gestion des événements de l'application
 * Sert d'interface unifiée pour interagir avec le bus d'événements
 */

import { eventBus, EventCallback } from "@/core/event-bus/EventBus";
import { AUTH_EVENTS } from "@/core/auth/domain/events";
import { USER_EVENTS } from "@/core/users/domain/events";
import { MODULE_MENU_EVENTS } from "@/services/coordination/ModuleMenuCoordinator";
import { SYSTEM_EVENTS, API_EVENTS } from "@/core/event-bus/events";

// Regroupement de tous les types d'événements pour une meilleure découvrabilité
export const EVENT_TYPES = {
  ...AUTH_EVENTS,
  ...USER_EVENTS,
  ...MODULE_MENU_EVENTS,
  ...SYSTEM_EVENTS,
  ...API_EVENTS
};

class EventService {
  /**
   * S'abonne à un événement
   * @param eventName Nom de l'événement
   * @param callback Fonction à appeler lors de l'événement
   * @returns Fonction pour se désabonner
   */
  subscribe<T = any>(eventName: string, callback: EventCallback<T>) {
    console.log(`[EventService] Abonnement à l'événement: ${eventName}`);
    return eventBus.subscribe(eventName, callback);
  }

  /**
   * Publie un événement
   * @param eventName Nom de l'événement
   * @param data Données associées à l'événement
   */
  publish<T = any>(eventName: string, data: T = {} as T) {
    console.log(`[EventService] Publication de l'événement: ${eventName}`, data);
    eventBus.publish(eventName, data);
  }

  /**
   * S'abonne à plusieurs événements avec un seul callback
   * @param eventNames Liste de noms d'événements
   * @param callback Fonction à appeler lors de ces événements
   * @returns Fonction pour se désabonner de tous les événements
   */
  subscribeToMultiple(eventNames: string[], callback: EventCallback) {
    const unsubscribes = eventNames.map(eventName => 
      this.subscribe(eventName, callback)
    );
    
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * S'abonne à un modèle d'événement à l'aide d'une expression régulière
   * @param pattern Expression régulière pour filtrer les événements
   * @param callback Fonction à appeler pour les événements correspondants
   * @returns Fonction pour se désabonner
   */
  subscribeToPattern<T = any>(pattern: RegExp, callback: EventCallback<T>) {
    return eventBus.subscribeToPattern(pattern, callback);
  }

  /**
   * Récupère l'historique des événements d'un type spécifique
   * @param eventName Nom de l'événement
   * @returns Tableau des événements passés
   */
  getHistory<T = any>(eventName: string): T[] {
    return eventBus.getHistory<T>(eventName);
  }

  /**
   * Supprime tous les abonnements pour un événement donné
   * @param eventName Nom de l'événement (optionnel)
   */
  clear(eventName?: string) {
    eventBus.clear(eventName);
  }
}

// Export d'une instance singleton du service
export const eventService = new EventService();
