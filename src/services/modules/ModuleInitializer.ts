
/**
 * Initialise le système de modules au démarrage de l'application
 * Utilise le nouveau ModuleService
 */
import { moduleService } from "./ModuleService";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_EVENTS } from "./ModuleEvents";

export const initializeModuleSystem = async (): Promise<boolean> => {
  try {
    console.log("Initialisation du système de modules...");
    
    // Initialiser le service de modules
    const success = await moduleService.initialize();
    
    if (success) {
      console.log("Système de modules initialisé avec succès");
      return true;
    } else {
      console.error("Échec de l'initialisation du système de modules");
      return false;
    }
  } catch (error) {
    console.error("Exception lors de l'initialisation du système de modules:", error);
    
    // Publier un événement d'erreur
    eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
      error: "Exception lors de l'initialisation du système de modules",
      context: "initialization",
      timestamp: Date.now()
    });
    
    return false;
  }
};

// Détecter les changements de connexion réseau pour synchroniser les modules
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log("Connexion réseau rétablie, synchronisation des modules...");
    eventBus.publish(MODULE_EVENTS.MODULE_CONNECTION_RESTORED, {
      isConnected: true,
      lastAttempt: Date.now(),
      retryCount: 0
    });
    
    moduleService.refreshModules(true).catch(console.error);
  });
  
  window.addEventListener('offline', () => {
    console.log("Connexion réseau perdue");
    eventBus.publish(MODULE_EVENTS.MODULE_CONNECTION_ERROR, {
      isConnected: false,
      lastAttempt: Date.now(),
      retryCount: 0
    });
  });
}
