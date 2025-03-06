
import { useEffect, useState } from 'react';
import { ModuleOptimizer } from '@/services/performance/ModuleOptimizer';
import { useModules } from '@/hooks/modules';
import { ModuleService } from '@/services/modules/ModuleService';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const [initialized, setInitialized] = useState(false);
  const { initializeModules } = useModules();
  
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing app...');
        
        // Initialize modules
        await initializeModules();
        
        // Initialize other services
        const moduleService = new ModuleService();
        await moduleService.initializeModules();
        
        // Preload module resources for better performance
        const moduleOptimizer = new ModuleOptimizer();
        await moduleOptimizer.preloadPriorityModules();
        
        console.log('App initialized successfully');
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Attempt recovery or show error UI
        setInitialized(true); // Still set to true to avoid blocking the app
      }
    };
    
    initialize();
  }, [initializeModules]);
  
  if (!initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  return <>{children}</>;
};
