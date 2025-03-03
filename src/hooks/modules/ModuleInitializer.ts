
import { APP_MODULES } from "./definitions/AppModules";
import { moduleRegistry } from "./services/ModuleRegistry";
import { moduleDbService } from "./services/ModuleDbService";

/**
 * Initialise le système de modules au démarrage de l'application
 */
export async function initializeModuleSystem(): Promise<void> {
  console.log("Initialisation du système de modules...");
  
  try {
    // S'assurer que tous les modules sont enregistrés
    // Cette partie doit être adaptée car moduleRegistry n'a pas de méthodes register ni getModule
    // Nous allons plutôt utiliser les méthodes disponibles dans l'API actuelle
    
    // Vérifier si les modules sont déjà initialisés
    if (!moduleRegistry.getInitialized()) {
      // Initialiser le registre
      await moduleRegistry.initialize();
      
      console.log("Registre de modules initialisé");
    }
    
    // Charger l'état initial depuis la base de données
    const modules = await moduleDbService.fetchAllModules();
    const features = await moduleDbService.fetchAllFeatures();
    
    // Déclencher un rafraîchissement des modules
    // Nous n'utilisons pas loadFromApiData qui n'existe pas dans l'API actuelle
    await moduleRegistry.refreshModules(true);
    
    console.log(`Système de modules initialisé avec ${modules.length} modules`);
    
    // Émettre un événement pour indiquer que le système est prêt
    window.dispatchEvent(new CustomEvent('module_system_ready'));
  } catch (error) {
    console.error("Erreur lors de l'initialisation du système de modules:", error);
    
    // En cas d'erreur, on essaie quand même de charger depuis le cache local
    try {
      const cachedModulesData = localStorage.getItem('modules_cache');
      if (cachedModulesData) {
        const cachedModules = JSON.parse(cachedModulesData);
        console.warn(`Utilisation du cache pour ${cachedModules.length} modules suite à une erreur d'initialisation`);
        
        // Au lieu d'utiliser loadFromApiData, utilisons l'API actuelle
        // Nous pouvons déclencher un événement de modules mis à jour
        window.dispatchEvent(new CustomEvent('modules_updated'));
        
        // Émettre un événement d'initialisation partielle
        window.dispatchEvent(new CustomEvent('module_system_partial_init'));
      }
    } catch (cacheError) {
      console.error("Erreur lors de la lecture du cache des modules:", cacheError);
    }
  }
}

// Initialiser automatiquement le système
// On peut également exporter la fonction pour l'appeler manuellement au démarrage de l'application
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initializeModuleSystem();
  });
}
