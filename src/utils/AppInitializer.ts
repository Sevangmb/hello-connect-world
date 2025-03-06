
import { eventBus } from '@/core/event-bus/EventBus';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';

export class AppInitializer {
  /**
   * Initialize the application
   */
  async initializeApp(): Promise<void> {
    console.log('Initializing application...');
    
    try {
      // Initialiser le bus d'événements
      this.initializeEventBus();
      
      // Précharger les modules communs
      this.preloadModules();
      
      // Initialiser le coordinateur de menu
      this.initializeMenuCoordinator();
      
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Error initializing application:', error);
      throw error;
    }
  }
  
  /**
   * Initialize event bus
   */
  private initializeEventBus(): void {
    console.log('Initializing event bus...');
    eventBus.subscribe('app:initialized', () => {
      console.log('Application initialization event received');
    });
  }
  
  /**
   * Preload modules
   */
  private preloadModules(): void {
    console.log('Preloading common modules...');
    moduleOptimizer.preloadPriorityModules();
  }
  
  /**
   * Initialize menu coordinator
   */
  private initializeMenuCoordinator(): void {
    console.log('Initializing menu coordinator...');
    moduleMenuCoordinator.refreshMenuItems();
  }
}
