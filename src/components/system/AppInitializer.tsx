
import { useEffect, useState } from 'react';
import { AppInitializer } from '@/utils/AppInitializer';
import { ModuleInitializer } from '@/services/modules/ModuleInitializer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

/**
 * AppInitializer Component
 * This component initializes the app on startup
 */
export function AppInitializerComponent() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const appInitializer = new AppInitializer();
        await appInitializer.initialize();
        
        const moduleInitializer = new ModuleInitializer();
        await moduleInitializer.initializeModules();
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize application');
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Initialization Error</h1>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg font-medium text-gray-700">Initializing application...</p>
        </div>
      </div>
    );
  }

  return null;
}
