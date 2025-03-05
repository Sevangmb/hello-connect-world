
/**
 * Service responsable de l'initialisation des modules
 * Gère le chargement et la configuration des modules
 */

import { moduleService } from './ModuleService';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_EVENTS } from './ModuleEvents';
import { CORE_MODULES, MODULES } from '@/modules/ModuleRegistry';

class ModuleInitializationService {
  private initialized = false;
  
  /**
   * Initialise tous les modules de l'application
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }
    
    console.log('Initialisation des modules...');
    
    try {
      // Initialiser le service de modules principal
      const moduleServiceInitialized = await moduleService.initialize();
      
      if (!moduleServiceInitialized) {
        console.error('Échec de l\'initialisation du service de modules');
        return false;
      }
      
      // Publier un événement pour signaler le début de l'initialisation
      eventBus.publish(MODULE_EVENTS.MODULES_INITIALIZATION_STARTED, {
        timestamp: Date.now(),
        moduleCount: Object.keys(MODULES).length,
        coreModules: CORE_MODULES
      });
      
      // Vérifier les modules présents dans la base de données
      const modules = await moduleService.refreshModules();
      console.log(`${modules.length} modules chargés depuis la base de données`);
      
      // Vérifier si tous les modules core sont disponibles
      const missingCoreModules = this.checkMissingCoreModules(modules.map(m => m.code));
      
      if (missingCoreModules.length > 0) {
        console.warn('Modules core manquants:', missingCoreModules);
        // Continuer quand même, les modules manquants seront ajoutés automatiquement 
        // lors de la prochaine maintenance ou synchronisation
      }
      
      // Initialiser les fonctionnalités
      await moduleService.refreshFeatures();
      
      // Initialiser les dépendances
      await moduleService.refreshDependencies();
      
      // Publier un événement pour signaler la fin de l'initialisation
      eventBus.publish(MODULE_EVENTS.MODULES_INITIALIZATION_COMPLETED, {
        timestamp: Date.now(),
        success: true,
        moduleCount: modules.length,
        missingCoreModules: missingCoreModules.length > 0 ? missingCoreModules : undefined
      });
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des modules:', error);
      
      // Publier un événement d'erreur
      eventBus.publish(MODULE_EVENTS.MODULE_ERROR, {
        error: `Erreur lors de l'initialisation: ${error}`,
        context: 'initialization',
        timestamp: Date.now()
      });
      
      return false;
    }
  }
  
  /**
   * Vérifie s'il manque des modules core
   */
  private checkMissingCoreModules(availableModules: string[]): string[] {
    return CORE_MODULES.filter(coreModule => !availableModules.includes(coreModule));
  }
  
  /**
   * Vérifie si l'initialisation a été effectuée
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Exporter une instance unique pour toute l'application
export const moduleInitializationService = new ModuleInitializationService();
