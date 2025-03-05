
import { ModuleInitializer } from '@/services/modules/ModuleInitializer';
import { supabase } from '@/integrations/supabase/client';
import { eventBus } from '@/core/event-bus/EventBus';

/**
 * Application Initializer
 * Handles initialization of various modules and services
 */
export class AppInitializer {
  private moduleInitializer: ModuleInitializer;
  
  constructor() {
    this.moduleInitializer = new ModuleInitializer();
  }
  
  /**
   * Initialize the application
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('Starting app initialization...');
      
      // Check Supabase connection
      const { error } = await supabase.from('site_stats').select('count(*)', { count: 'exact' });
      if (error) {
        console.error('Failed to connect to Supabase:', error);
        return false;
      }
      
      // Initialize event bus
      eventBus.initialize();
      
      // Initialize modules
      await this.initializeModules();
      
      console.log('App initialization completed successfully');
      return true;
    } catch (error) {
      console.error('Error during app initialization:', error);
      return false;
    }
  }
  
  /**
   * Initialize modules
   */
  private async initializeModules(): Promise<boolean> {
    try {
      await this.moduleInitializer.initializeModule('core');
      return true;
    } catch (error) {
      console.error('Error initializing modules:', error);
      return false;
    }
  }
}
