
import { useState, useEffect } from 'react';
import { moduleOptimizer } from '@/services/performance/ModuleOptimizer';
import { useModules } from '@/hooks/modules';
import { ModuleService } from '@/services/modules/ModuleService';

export class AppInitializer {
  private moduleService: ModuleService;

  constructor() {
    this.moduleService = new ModuleService();
  }

  /**
   * Initialize the application modules and services
   */
  public async initialize(): Promise<boolean> {
    try {
      console.log('Initializing app...');
      
      // Initialize modules
      await this.moduleService.initializeModules();
      
      // Preload module resources for better performance
      await moduleOptimizer.preloadPriorityModules();
      
      console.log('App initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Attempt recovery
      return false;
    }
  }
}

/**
 * React hook for app initialization
 */
export const useAppInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { refreshModules } = useModules();
  
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        
        const initializer = new AppInitializer();
        await initializer.initialize();
        
        // Refresh modules to ensure the latest data
        await refreshModules();
        
        setInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
  }, [refreshModules]);
  
  return { initialized, loading };
};
