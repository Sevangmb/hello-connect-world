
import { EventBus } from '@/core/event-bus/EventBus';
import { moduleInitializer } from '@/services/modules/ModuleInitializer';
import { supabase } from '@/integrations/supabase/client';

/**
 * Class that initializes the application
 */
export class AppInitializer {
  private static instance: AppInitializer;
  private eventBus: EventBus;
  private isInitialized = false;

  private constructor() {
    this.eventBus = new EventBus();
  }

  /**
   * Get the instance of AppInitializer
   */
  public static getInstance(): AppInitializer {
    if (!AppInitializer.instance) {
      AppInitializer.instance = new AppInitializer();
    }
    return AppInitializer.instance;
  }

  /**
   * Initialize the application
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    try {
      // Initialize modules
      const modulesInitialized = await moduleInitializer.initializeModules();
      
      if (modulesInitialized) {
        this.isInitialized = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error initializing application:', error);
      return false;
    }
  }
  
  /**
   * Check if the application is initialized
   */
  public isApplicationInitialized(): boolean {
    return this.isInitialized;
  }
  
  /**
   * Get the event bus
   */
  public getEventBus(): EventBus {
    return this.eventBus;
  }
}

// Export the instance
export const appInitializer = AppInitializer.getInstance();
