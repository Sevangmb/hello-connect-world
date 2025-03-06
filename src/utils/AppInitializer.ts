
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { eventBus } from "@/core/event-bus/EventBus";
import { ModuleInitializer } from "@/services/modules/ModuleInitializer";
import { moduleOptimizer } from "@/services/performance/ModuleOptimizer";

/**
 * Application initializer - bootstraps the app services
 */
export class AppInitializer {
  private moduleInitializer: ModuleInitializer = new ModuleInitializer();
  private hasInitialized: boolean = false;

  /**
   * Initialize the application
   */
  async initializeApp(): Promise<boolean> {
    if (this.hasInitialized) {
      return true;
    }

    try {
      // Initialize event bus
      eventBus.initialize();
      
      // Initialize modules
      await this.moduleInitializer.initializeModules();
      
      // Preload common modules
      moduleOptimizer.preloadCommonModules();
      
      // Initialize menu system
      moduleMenuCoordinator.initializeMenu();

      this.hasInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing app:', error);
      this.hasInitialized = false;
      return false;
    }
  }
}

export const appInitializer = new AppInitializer();
