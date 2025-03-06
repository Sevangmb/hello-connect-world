
import { ModuleInitializer } from '@/services/modules/ModuleInitializer';
import { eventBus } from '@/core/event-bus/EventBus';

/**
 * Initialise les services de l'application
 */
export class AppInitializer {
  private moduleInitializer = new ModuleInitializer();

  async initialize() {
    console.log('Initialisation de l\'application...');
    
    // Initialiser les modules
    await this.initializeModules();
    
    // Publier un événement d'initialisation terminée
    eventBus.publish('app:initialized', {
      timestamp: Date.now()
    });
    
    console.log('Initialisation de l\'application terminée');
  }

  private async initializeModules() {
    console.log('Initialisation des modules...');
    await this.moduleInitializer.initialize();
    console.log('Modules initialisés avec succès');
  }
}
