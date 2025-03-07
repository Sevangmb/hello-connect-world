
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initializeModules } from '@/hooks/modules/ModuleInitializer';

const InitializeModules = () => {
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeModules();
        console.log('Modules initialized successfully');
      } catch (error) {
        console.error('Error initializing modules:', error);
        toast({
          variant: 'destructive',
          title: 'Initialization Error',
          description: 'Failed to initialize modules'
        });
      }
    };

    initialize();
  }, [toast]);

  return null;
};

export default InitializeModules;
