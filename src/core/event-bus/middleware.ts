
/**
 * Middleware pour l'Event Bus
 * Permet d'intercepter et de transformer les événements
 */
import { EventCallback } from './EventBus';

// Type pour les fonctions middleware
export type EventMiddleware = (eventName: string, data: any, next: () => void) => void;

// Liste des middlewares enregistrés
const middlewares: EventMiddleware[] = [];

/**
 * Ajoute un middleware à la chaîne de traitement
 * @param middleware Fonction middleware à ajouter
 */
export const addMiddleware = (middleware: EventMiddleware): void => {
  middlewares.push(middleware);
};

/**
 * Exécute la chaîne de middlewares
 * @param eventName Nom de l'événement
 * @param data Données de l'événement
 * @param callback Callback final
 */
export const executeMiddlewareChain = (eventName: string, data: any, callback: EventCallback): void => {
  let index = 0;
  
  // Fonction pour passer au middleware suivant
  const next = () => {
    if (index < middlewares.length) {
      const middleware = middlewares[index++];
      middleware(eventName, data, next);
    } else {
      // Une fois tous les middlewares exécutés, appeler le callback final
      callback(data);
    }
  };
  
  // Démarrer la chaîne de middlewares
  next();
};

/**
 * Supprime un middleware de la chaîne de traitement
 * @param middleware Middleware à supprimer
 */
export const removeMiddleware = (middleware: EventMiddleware): void => {
  const index = middlewares.indexOf(middleware);
  if (index !== -1) {
    middlewares.splice(index, 1);
  }
};

/**
 * Supprime tous les middlewares
 */
export const clearMiddlewares = (): void => {
  middlewares.length = 0;
};
