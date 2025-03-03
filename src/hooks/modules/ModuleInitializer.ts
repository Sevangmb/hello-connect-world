
import { AppModules } from "./definitions/AppModules";
import { moduleRegistry } from "./services/ModuleRegistry";
import { ModuleDbService } from "./services/ModuleDbService";

/**
 * Initialise le système de modules au démarrage de l'application
 */
export async function initializeModuleSystem(): Promise<void> {
  console.log("Initialisation du système de modules...");
  
  try {
    // S'assurer que tous les modules sont enregistrés
    // (Cela devrait déjà être fait par l'import des définitions, mais on le fait quand même pour être sûr)
    AppModules.forEach(module => {
      if (!moduleRegistry.getModule(module.code)) {
        moduleRegistry.register(module);
      }
    });
    
    // Charger l'état initial depuis la base de données
    const [modules, features] = await Promise.all([
      ModuleDbService.loadAllModules(),
      ModuleDbService.loadAllFeatures()
    ]);
    
    // Charger les données dans le registre
    moduleRegistry.loadFromApiData(modules, features);
    
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
        
        // Créer un objet features vide pour éviter les erreurs
        const emptyFeatures: Record<string, Record<string, boolean>> = {};
        moduleRegistry.loadFromApiData(cachedModules, emptyFeatures);
        
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
