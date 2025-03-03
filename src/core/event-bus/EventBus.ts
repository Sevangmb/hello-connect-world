
/**
 * Système d'Event Bus central pour l'architecture microservices
 * Permet la communication entre services via des événements
 */

// Types pour le système d'événements
export type EventCallback<T = any> = (data: T) => void;
export type UnsubscribeFunction = () => void;

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();
  private eventHistory: Map<string, any[]> = new Map();
  private maxHistorySize = 10;

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

    // Retourner une fonction pour se désabonner
    return () => {
      const callbacks = this.events.get(eventName);
      if (callbacks) {
        callbacks.delete(callback as EventCallback);
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

    // Notifier tous les abonnés
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erreur lors du traitement de l'événement ${eventName}:`, error);
        }
      });
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

    return () => {
      window.removeEventListener(`event_bus:${eventName}`, handler);
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
   * Supprime tous les abonnements à un événement
   * @param eventName Nom de l'événement
   */
  clear(eventName?: string): void {
    if (eventName) {
      this.events.delete(eventName);
      this.eventHistory.delete(eventName);
    } else {
      this.events.clear();
      this.eventHistory.clear();
    }
  }
}

// Exporter une instance unique pour toute l'application
export const eventBus = new EventBus();
