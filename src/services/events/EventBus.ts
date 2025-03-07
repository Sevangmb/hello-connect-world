
/**
 * Service de bus d'événements pour la communication entre modules
 */
type EventCallback = (data?: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]>;

  constructor() {
    this.events = new Map();
  }

  /**
   * S'abonner à un événement
   */
  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const callbacks = this.events.get(event) as EventCallback[];
    callbacks.push(callback);

    // Retourner une fonction de désinscription
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Publier un événement
   */
  publish(event: string, data?: any): void {
    if (!this.events.has(event)) {
      return;
    }

    const callbacks = this.events.get(event) as EventCallback[];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Erreur lors de l'exécution du callback pour l'événement ${event}:`, error);
      }
    });
  }

  /**
   * Effacer tous les abonnements pour un événement
   */
  clear(event: string): void {
    this.events.delete(event);
  }

  /**
   * Effacer tous les événements
   */
  clearAll(): void {
    this.events.clear();
  }
}

// Instance globale unique
export const eventBus = new EventBus();

// Constantes d'événements pour améliorer la cohérence
export const EVENTS = {
  NAVIGATION: {
    ROUTE_CHANGED: 'navigation:route_changed',
    MENU_ITEM_CLICKED: 'navigation:menu_item_clicked'
  },
  MODULE: {
    STATUS_CHANGED: 'module:status_changed',
    INITIALIZED: 'module:initialized'
  },
  AUTH: {
    USER_LOGGED_IN: 'auth:user_logged_in',
    USER_LOGGED_OUT: 'auth:user_logged_out'
  },
  SHOP: {
    SHOP_SELECTED: 'shop:shop_selected',
    CART_UPDATED: 'shop:cart_updated'
  }
};
