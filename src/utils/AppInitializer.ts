
import { moduleInitializer } from '@/services/modules/ModuleInitializer';

export const appInitializer = {
  initializeApp: async (): Promise<boolean> => {
    try {
      console.log('Initializing application...');
      
      // Track initialization steps
      const initSteps = {
        modules: false,
        settings: false,
        auth: false
      };
      
      // Initialize modules first
      const modulesInitialized = await moduleInitializer.initializeModules();
      initSteps.modules = !!modulesInitialized;
      
      // Later, additional initialization steps can be added here
      
      return Object.values(initSteps).every(Boolean);
    } catch (error) {
      console.error('Application initialization failed:', error);
      return false;
    }
  }
};
