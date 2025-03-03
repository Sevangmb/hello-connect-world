
/**
 * Middleware pour l'Event Bus
 * Permet d'ajouter des comportements avant ou après la publication d'événements
 */
import { EventCallback } from './EventBus';

export type EventMiddleware = (eventName: string, data: any, next: () => void) => void;

export class EventBusMiddleware {
  private static middlewares: EventMiddleware[] = [];

  /**
   * Ajoute un middleware à la chaîne
   * @param middleware Fonction de middleware
   */
  static use(middleware: EventMiddleware): void {
    this.middlewares.push(middleware);
  }

  /**
   * Exécute la chaîne de middleware
   * @param eventName Nom de l'événement
   * @param data Données de l'événement
   * @param callback Callback final à exécuter
   */
  static execute(eventName: string, data: any, callback: EventCallback): void {
    let index = 0;
    
    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        middleware(eventName, data, next);
      } else {
        callback(data);
      }
    };
    
    next();
  }
}

// Middleware de journalisation
export const loggingMiddleware: EventMiddleware = (eventName, data, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Event Bus] Event: ${eventName}`, data);
  }
  next();
};

// Middleware de filtrage des événements sensibles en production
export const sensitiveDataFilterMiddleware: EventMiddleware = (eventName, data, next) => {
  if (process.env.NODE_ENV === 'production' && data) {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'apiKey', 'credential'];
    
    if (typeof data === 'object' && data !== null) {
      for (const field of sensitiveFields) {
        if (field in data) {
          data = { ...data, [field]: '***REDACTED***' };
        }
      }
    }
  }
  next();
};

// Middleware de métriques de performance
export const performanceMetricsMiddleware: EventMiddleware = (eventName, data, next) => {
  // Ajouter automatiquement un timestamp si non présent
  if (typeof data === 'object' && data !== null && !('timestamp' in data)) {
    data = { ...data, timestamp: Date.now() };
  }
  
  // Enregistrer le temps passé sur les événements de performance
  if (eventName.includes('performance') || eventName.includes('metrics')) {
    console.debug(`[Performance] ${eventName}:`, data);
    
    // On pourrait envoyer ces données à un service de télémétrie ici
  }
  
  next();
};

// Initialiser les middlewares par défaut
EventBusMiddleware.use(sensitiveDataFilterMiddleware);
EventBusMiddleware.use(loggingMiddleware);
EventBusMiddleware.use(performanceMetricsMiddleware);
