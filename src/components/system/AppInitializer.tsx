
import React, { useEffect, useState } from 'react';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { ModuleInitializer } from '@/services/modules/ModuleInitializer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const moduleInitializer = new ModuleInitializer();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing application...');
        
        // Initialize module system
        const initialized = await moduleInitializer.initializeAllModules();
        
        if (initialized) {
          console.log('Application initialized successfully');
          setIsInitialized(true);
        } else {
          setError('Failed to initialize the application. Please try refreshing the page.');
        }
      } catch (error) {
        console.error('Error initializing application:', error);
        setError('An unexpected error occurred during initialization. Please try refreshing the page.');
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <h1 className="mb-4 text-2xl font-bold">Initialization Error</h1>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Initializing application...</p>
      </div>
    );
  }

  return <>{children}</>;
};
