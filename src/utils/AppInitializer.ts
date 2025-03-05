
/**
 * Initialisation de l'application
 */
import { moduleInitialization } from '@/hooks/modules/hooks/moduleInitialization';
import { ModuleInitializer } from '@/services/modules/ModuleInitializer';
import { ModuleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

export const AppInitializer = {
  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing app...');
      
      // Initialiser les modules
      await moduleInitialization.initializeModules();
      
      // Initialiser l'API des modules
      const moduleApiGateway = new ModuleApiGateway();
      await moduleApiGateway.initialize();
      
      // Initialiser les services de modules
      const moduleInitializer = new ModuleInitializer();
      await moduleInitializer.initialize();
      
      console.log('App initialization complete');
      return true;
    } catch (error) {
      console.error('Error initializing app:', error);
      return false;
    }
  }
};
