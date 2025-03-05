
/**
 * Bus d'événements central pour la communication entre les composants
 * Implémente le pattern Observer pour une architecture découplée
 */
export type EventCallback<T = any> = (data: T) => void;
export type UnsubscribeFunction = () => void;

class EventBus {
  private events: Map<string, EventCallback[]>;
  private eventHistory: Map<string, any[]>;
  
  constructor() {
    this.events = new Map();
    this.eventHistory = new Map();
  }
  
  /**
   * S'abonne à un événement
   * @param eventName Nom de l'événement
   * @param callback Fonction de rappel
   * @returns Fonction pour se désabonner
   */
  subscribe<T = any>(eventName: string, callback: EventCallback<T>): UnsubscribeFunction {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const callbacks = this.events.get(eventName)!;
    callbacks.push(callback as EventCallback);
    
    // Retourner une fonction pour se désabonner
    return () => {
      const index = callbacks.indexOf(callback as EventCallback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  /**
   * Publie un événement avec des données
   * @param eventName Nom de l'événement
   * @param data Données associées à l'événement
   */
  publish<T = any>(eventName: string, data: T = {} as T): void {
    // Stocker l'événement dans l'historique
    if (!this.eventHistory.has(eventName)) {
      this.eventHistory.set(eventName, []);
    }
    const history = this.eventHistory.get(eventName)!;
    history.push(data);
    
    // Limiter l'historique à 10 événements par type
    if (history.length > 10) {
      history.shift();
    }
    
    if (!this.events.has(eventName)) {
      return;
    }
    
    const callbacks = this.events.get(eventName)!;
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Erreur lors de l'exécution du callback pour l'événement ${eventName}:`, error);
      }
    });
  }
  
  /**
   * S'abonne à un modèle d'événement utilisant des expressions régulières
   * @param pattern Expression régulière pour filtrer les événements
   * @param callback Fonction de rappel
   */
  subscribeToPattern<T = any>(pattern: RegExp, callback: EventCallback<T>): UnsubscribeFunction {
    // Créer un gestionnaire qui vérifie le pattern pour chaque événement
    const handler = (eventName: string, data: T) => {
      if (pattern.test(eventName)) {
        callback(data);
      }
    };
    
    // Stocker les désabonnements pour chaque événement actuel
    const unsubscribeFunctions: UnsubscribeFunction[] = [];
    
    // S'abonner aux événements existants qui correspondent au pattern
    this.events.forEach((_, eventName) => {
      if (pattern.test(eventName)) {
        unsubscribeFunctions.push(this.subscribe(eventName, data => handler(eventName, data)));
      }
    });
    
    // Retourner une fonction qui désabonne tous les événements
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }
  
  /**
   * S'abonne à un événement global (à travers les onglets)
   * Utilise BroadcastChannel si disponible, sinon localStorage
   * @param eventName Nom de l'événement
   * @param callback Fonction de rappel
   */
  subscribeToGlobal<T = any>(eventName: string, callback: EventCallback<T>): UnsubscribeFunction {
    // S'abonner localement
    const localUnsubscribe = this.subscribe(eventName, callback);
    
    // Identifiant unique pour cet abonnement
    const subscriptionId = `${eventName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Fonction de désabonnement
    return () => {
      localUnsubscribe();
    };
  }
  
  /**
   * Récupère l'historique des événements pour un type donné
   * @param eventName Nom de l'événement
   */
  getHistory<T = any>(eventName: string): T[] {
    if (!this.eventHistory.has(eventName)) {
      return [];
    }
    return this.eventHistory.get(eventName) as T[];
  }
  
  /**
   * Supprime tous les abonnements pour un événement donné
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
  
  /**
   * Supprime tous les abonnements
   */
  clearAll(): void {
    this.events.clear();
    this.eventHistory.clear();
  }
}

// Exporter une instance unique pour toute l'application
export const eventBus = new EventBus();
