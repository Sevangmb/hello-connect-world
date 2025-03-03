
/**
 * Système d'Event Bus central pour l'architecture microservices
 * Permet la communication entre services via des événements
 */

import { EventBusMiddleware } from './middleware';

// Types pour le système d'événements
export type EventCallback<T = any> = (data: T) => void;
export type UnsubscribeFunction = () => void;

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();
  private eventHistory: Map<string, any[]> = new Map();
  private maxHistorySize = 10;
  private debug: boolean = process.env.NODE_ENV !== 'production';

  /**
   * S'abonne à un événement
   * @param eventName Nom de l'événement
   * @param callback Fonction à appeler quand l'événement est émis
   * @returns Fonction pour se désabonner
   */
  subscribe<T = any>(eventName: string, callback: EventCallback<T>): UnsubscribeFunction {
    // Créer un ensemble de callbacks si nécessaire
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    const callbacks = this.events.get(eventName)!;
    callbacks.add(callback as EventCallback);

    if (this.debug) {
      console.debug(`[EventBus] Subscription to "${eventName}", current subscribers: ${callbacks.size}`);
    }

    // Retourner une fonction pour se désabonner
    return () => {
      const callbacks = this.events.get(eventName);
      if (callbacks) {
        callbacks.delete(callback as EventCallback);
        if (this.debug) {
          console.debug(`[EventBus] Unsubscription from "${eventName}", remaining subscribers: ${callbacks.size}`);
        }
      }
    };
  }

  /**
   * Émet un événement à tous les abonnés
   * @param eventName Nom de l'événement
   * @param data Données à transmettre
   */
  publish<T = any>(eventName: string, data: T): void {
    // Enregistrer l'événement dans l'historique
    this.addToHistory(eventName, data);

    // Notifier tous les abonnés via le middleware
    const callbacks = this.events.get(eventName);
    if (callbacks && callbacks.size > 0) {
      callbacks.forEach(callback => {
        try {
          // Utiliser le middleware pour traiter l'événement
          EventBusMiddleware.execute(eventName, data, callback);
        } catch (error) {
          console.error(`Erreur lors du traitement de l'événement ${eventName}:`, error);
        }
      });
    } else if (this.debug) {
      console.debug(`[EventBus] Event "${eventName}" published but no subscribers`);
    }

    // Émettre également un événement DOM pour la synchronisation entre onglets
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent(`event_bus:${eventName}`, { detail: data }));
      } catch (error) {
        console.error(`Erreur lors de l'émission de l'événement DOM ${eventName}:`, error);
      }
    }
  }

  /**
   * S'abonne aux événements émis dans d'autres onglets
   * @param eventName Nom de l'événement
   * @param callback Fonction à appeler
   * @returns Fonction pour se désabonner
   */
  subscribeToGlobal<T = any>(eventName: string, callback: EventCallback<T>): UnsubscribeFunction {
    if (typeof window === 'undefined') return () => {};

    const handler = (event: Event) => {
      if (event instanceof CustomEvent) {
        callback(event.detail);
      }
    };

    window.addEventListener(`event_bus:${eventName}`, handler);

    if (this.debug) {
      console.debug(`[EventBus] Global subscription to "${eventName}"`);
    }

    return () => {
      window.removeEventListener(`event_bus:${eventName}`, handler);
      if (this.debug) {
        console.debug(`[EventBus] Global unsubscription from "${eventName}"`);
      }
    };
  }

  /**
   * S'abonne à plusieurs événements à la fois
   * @param events Tableau de noms d'événements
   * @param callback Fonction à appeler
   * @returns Tableau de fonctions pour se désabonner
   */
  subscribeToMany(events: string[], callback: EventCallback): UnsubscribeFunction[] {
    return events.map(eventName => this.subscribe(eventName, callback));
  }

  /**
   * S'abonne à tous les événements correspondant à un pattern
   * @param pattern Expression régulière à matcher avec les noms d'événements
   * @param callback Fonction à appeler
   * @returns Fonction pour se désabonner de tous les événements
   */
  subscribeToPattern(pattern: RegExp, callback: EventCallback): UnsubscribeFunction {
    const unsubscribeFunctions: UnsubscribeFunction[] = [];

    // S'abonner à tous les événements existants qui correspondent au pattern
    for (const eventName of this.events.keys()) {
      if (pattern.test(eventName)) {
        unsubscribeFunctions.push(this.subscribe(eventName, callback));
      }
    }

    // S'abonner également au métaévénement pour les nouveaux événements
    const metaUnsubscribe = this.subscribe('eventbus:newevent', (data: { eventName: string }) => {
      if (pattern.test(data.eventName) && !this.events.has(data.eventName)) {
        unsubscribeFunctions.push(this.subscribe(data.eventName, callback));
      }
    });

    unsubscribeFunctions.push(metaUnsubscribe);

    // Retourner une fonction qui se désabonne de tous les événements
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * Récupère l'historique des événements d'un type donné
   * @param eventName Nom de l'événement
   * @returns Tableau des derniers événements
   */
  getHistory<T = any>(eventName: string): T[] {
    return (this.eventHistory.get(eventName) || []) as T[];
  }

  /**
   * Ajoute un événement à l'historique
   * @param eventName Nom de l'événement
   * @param data Données de l'événement
   */
  private addToHistory(eventName: string, data: any): void {
    if (!this.eventHistory.has(eventName)) {
      this.eventHistory.set(eventName, []);
      
      // Publier un méta-événement pour le pattern matching
      if (eventName !== 'eventbus:newevent') {
        this.publish('eventbus:newevent', { eventName });
      }
    }

    const history = this.eventHistory.get(eventName)!;
    history.push(data);

    // Limiter la taille de l'historique
    if (history.length > this.maxHistorySize) {
      history.shift();
    }
  }

  /**
   * Configure la taille maximale de l'historique des événements
   * @param size Nombre d'événements à conserver
   */
  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;
  }

  /**
   * Configure le mode debug
   * @param enabled Activer ou désactiver le mode debug
   */
  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  /**
   * Supprime tous les abonnements à un événement
   * @param eventName Nom de l'événement
   */
  clear(eventName?: string): void {
    if (eventName) {
      this.events.delete(eventName);
      this.eventHistory.delete(eventName);
      if (this.debug) {
        console.debug(`[EventBus] Cleared event "${eventName}"`);
      }
    } else {
      this.events.clear();
      this.eventHistory.clear();
      if (this.debug) {
        console.debug(`[EventBus] Cleared all events`);
      }
    }
  }

  /**
   * Vérifie si un événement a des abonnés
   * @param eventName Nom de l'événement
   * @returns True si l'événement a des abonnés
   */
  hasSubscribers(eventName: string): boolean {
    const callbacks = this.events.get(eventName);
    return !!callbacks && callbacks.size > 0;
  }

  /**
   * Récupère le nombre d'abonnés à un événement
   * @param eventName Nom de l'événement
   * @returns Nombre d'abonnés
   */
  getSubscriberCount(eventName: string): number {
    const callbacks = this.events.get(eventName);
    return callbacks ? callbacks.size : 0;
  }
}

// Exporter une instance unique pour toute l'application
export const eventBus = new EventBus();
