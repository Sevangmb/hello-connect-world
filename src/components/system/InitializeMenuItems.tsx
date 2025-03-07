
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import seedMenuItems from '@/services/menu/infrastructure/MenuSeeder';

export const InitializeMenuItems: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      if (!initialized) {
        try {
          const success = await seedMenuItems();
          
          if (success) {
            console.log('Menu items initialized successfully.');
          } else {
            console.error('Failed to initialize menu items.');
            toast({
              title: 'Erreur',
              description: 'Impossible d\'initialiser les éléments de menu.',
              variant: 'destructive'
            });
          }
        } catch (error) {
          console.error('Error during menu items initialization:', error);
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de l\'initialisation des éléments de menu.',
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

export default InitializeMenuItems;
