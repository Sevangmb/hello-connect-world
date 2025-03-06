
import { ModuleInitializer } from '@/services/modules/ModuleInitializer';
import { eventBus } from '@/core/event-bus/EventBus';
import { ModuleApiContextProvider } from '@/hooks/modules/ModuleApiContext';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';
import { ModuleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';

/**
 * Application initialization service
 * Coordinates startup processes and core module loading
 */
export class AppInitializer {
  private moduleInitializer: ModuleInitializer;
  private moduleMenuCoordinator: any; // Use any type to avoid constructor issues

  constructor() {
    this.moduleInitializer = new ModuleInitializer();
    // Create an instance without using constructor directly
    this.moduleMenuCoordinator = ModuleMenuCoordinator.getInstance();
  }

  /**
   * Initialize the application
   */
  public async initializeApp(): Promise<void> {
    console.log('Initializing application...');
    // Use event bus
    eventBus.publish('app:initializing');
    
    try {
      // Preload modules
      await moduleOptimizer.preloadModules();
      
      // Initialize modules
      await this.moduleInitializer.initializeModules();
      
      // Initialize menu
      await this.moduleMenuCoordinator.refreshMenu();
      
      eventBus.publish('app:initialized');
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Error initializing application:', error);
      eventBus.publish('app:initialization_error', { error });
    }
  }

  /**
   * Clean up resources when application is shutting down
   */
  public async cleanup(): Promise<void> {
    console.log('Cleaning up application resources...');
    eventBus.publish('app:cleanup');
    // Perform any cleanup needed
  }

  /**
   * Reinitialize the application (for hot reloads or after updates)
   */
  public async reinitialize(): Promise<void> {
    console.log('Reinitializing application...');
    eventBus.publish('app:reinitializing');
    
    try {
      // Reinitialize modules
      await this.moduleInitializer.initializeModules();
      
      // Refresh menu
      await this.moduleMenuCoordinator.refreshMenu();
      
      eventBus.publish('app:reinitialized');
      console.log('Application reinitialized successfully');
    } catch (error) {
      console.error('Error reinitializing application:', error);
      eventBus.publish('app:reinitialization_error', { error });
    }
  }
}
