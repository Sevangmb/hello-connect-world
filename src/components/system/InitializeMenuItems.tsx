
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { seedMenuItems } from '@/services/menu/infrastructure/MenuSeeder';

const InitializeMenuItems = () => {
  const { toast } = useToast();

  useEffect(() => {
    const initializeMenuItems = async () => {
      try {
        await seedMenuItems();
        console.log('Menu items initialized successfully');
      } catch (error) {
        console.error('Error initializing menu items:', error);
        toast({
          variant: 'destructive',
          title: 'Initialization Error',
          description: 'Failed to initialize menu items'
        });
      }
    };

    initializeMenuItems();
  }, [toast]);

  return null;
};

export default InitializeMenuItems;
