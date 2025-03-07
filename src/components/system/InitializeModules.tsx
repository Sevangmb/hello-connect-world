
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import initializeModules from '@/hooks/modules/ModuleInitializer';

export const InitializeModules: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      if (!initialized) {
        try {
          const success = await initializeModules();
          
          if (success) {
            console.log('Modules initialized successfully.');
          } else {
            console.error('Failed to initialize modules.');
            toast({
              title: 'Erreur',
              description: 'Impossible d\'initialiser les modules.',
              variant: 'destructive'
            });
          }
        } catch (error) {
          console.error('Error during modules initialization:', error);
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de l\'initialisation des modules.',
            variant: 'destructive'
          });
        } finally {
          setInitialized(true);
        }
      }
    };

    initialize();
  }, [toast, initialized]);

  return null;
};

export default InitializeModules;
