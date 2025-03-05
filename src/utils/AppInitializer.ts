
import { supabase } from '@/integrations/supabase/client';
import { preloadModuleStatuses } from '@/hooks/modules/hooks/status/modulePreload';
import { ModuleInitializer } from '@/services/modules/ModuleInitializer';
import { initializeModuleApi } from '@/hooks/modules/hooks/moduleInitialization';

/**
 * Initialise l'application
 */
export class AppInitializer {
  private static instance: AppInitializer;
  private initialized = false;
  private moduleInitializer: ModuleInitializer;

  private constructor() {
    this.moduleInitializer = new ModuleInitializer();
  }

  public static getInstance(): AppInitializer {
    if (!AppInitializer.instance) {
      AppInitializer.instance = new AppInitializer();
    }
    return AppInitializer.instance;
  }

  public async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    console.log('Initializing application...');
    try {
      // Initialize the auth listener
      this.initializeAuthListener();

      // Initialize modules
      await this.moduleInitializer.initializeModules();
      
      // Preload module statuses
      preloadModuleStatuses();

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize application:', error);
      return false;
    }
  }

  private initializeAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
      console.info('Supabase Auth Event:', event, session ? 'Session active' : 'No session');
      if (session?.user) {
        console.info('Utilisateur connecté:', session.user.id);
      } else {
        console.info('Aucun utilisateur connecté');
      }
    });
  }
}
