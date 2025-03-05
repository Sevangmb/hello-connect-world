
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

interface AppServicesProps {
  children: React.ReactNode;
}

export const AppServices: React.FC<AppServicesProps> = ({ children }) => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Attempt to initialize ModuleApiGateway
        await moduleApiGateway.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize services:', error);
        toast({
          title: 'Service Initialization Error',
          description: 'Some application services failed to initialize. Functionality may be limited.',
          variant: 'destructive',
        });
        // Continue with the app anyway, but let the user know there might be issues
        setIsInitialized(true);
      }
    };

    initializeServices();
  }, [toast]);

  // Return children regardless of initialization state to avoid blocking the UI
  // Issues with services will be communicated via toast
  return <>{children}</>;
};
