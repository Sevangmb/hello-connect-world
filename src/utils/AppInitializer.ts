
import { ModuleInitializer } from '@/services/modules/ModuleInitializer';
import { eventBus } from '@/core/event-bus/EventBus';

/**
 * Initializes the application
 */
export class AppInitializer {
  private moduleInitializer: ModuleInitializer;

  constructor() {
    // Initialize event bus
    this.moduleInitializer = new ModuleInitializer();
  }

  /**
   * Initialize the application
   * This is called at startup
   */
  async initialize(): Promise<void> {
    console.log('Initializing application...');
    try {
      // Initialize modules
      await this.initializeModules();
      
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  /**
   * Initialize all modules
   */
  private async initializeModules(): Promise<void> {
    console.log('Initializing modules...');
    const modules = await this.moduleInitializer.initializeModules();
    console.log(`Initialized ${modules.length} modules`);
  }
}
