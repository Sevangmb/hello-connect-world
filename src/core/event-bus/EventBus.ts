
/**
 * Bus d'événements central pour la communication entre les composants
 * Implémente le pattern Observer pour une architecture découplée
 */
type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]>;
  
  constructor() {
    this.events = new Map();
  }
  
  /**
   * S'abonne à un événement
   * @param eventName Nom de l'événement
   * @param callback Fonction de rappel
   * @returns Fonction pour se désabonner
   */
  subscribe(eventName: string, callback: EventCallback): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const callbacks = this.events.get(eventName)!;
    callbacks.push(callback);
    
    // Retourner une fonction pour se désabonner
    return () => {
      const index = callbacks.indexOf(callback);
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
  publish(eventName: string, data: any = {}): void {
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
   * Supprime tous les abonnements pour un événement donné
   * @param eventName Nom de l'événement
   */
  clear(eventName: string): void {
    this.events.delete(eventName);
  }
  
  /**
   * Supprime tous les abonnements
   */
  clearAll(): void {
    this.events.clear();
  }
}

// Exporter une instance unique pour toute l'application
export const eventBus = new EventBus();
