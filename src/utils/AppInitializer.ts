
import { eventBus } from '@/core/event-bus/EventBus';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { ModuleInitializationService } from '@/services/modules/ModuleInitializationService';

export class AppInitializer {
  private moduleInitService: ModuleInitializationService;
  
  constructor() {
    this.moduleInitService = new ModuleInitializationService();
  }
  
  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing application...');
      
      // Initialize event bus
      console.log('Initializing event bus...');
      
      // Initialize modules
      console.log('Initializing modules...');
      const modulesInitialized = await this.moduleInitService.initializeCoreModules();
      
      if (!modulesInitialized) {
        console.error('Failed to initialize modules');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing application:', error);
      return false;
    }
  }
}

export const appInitializer = new AppInitializer();
