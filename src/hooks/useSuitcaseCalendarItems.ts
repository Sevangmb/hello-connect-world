
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SuitcaseCalendarItem } from '@/components/suitcases/types';

// Mock implementation for calendar items since we're having database issues
// In a real app, this would connect to your actual database table
const mockCalendarItems: Record<string, SuitcaseCalendarItem[]> = {};

export const useSuitcaseCalendarItems = (suitcaseId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock fetch function that simulates database access
  const fetchCalendarItems = async (): Promise<SuitcaseCalendarItem[]> => {
    // In a real implementation, this would query your database
    return mockCalendarItems[suitcaseId] || [];
  };

  const query = useQuery({
    queryKey: ['suitcase-calendar-items', suitcaseId],
    queryFn: fetchCalendarItems,
    enabled: !!suitcaseId,
  });

  const addCalendarItem = useMutation({
    mutationFn: async (newItem: {
      suitcase_id: string;
      date: string;
      items: string[];
    }): Promise<SuitcaseCalendarItem> => {
      // Mock implementation
      const newCalendarItem: SuitcaseCalendarItem = {
        id: `cal-${Date.now()}`,
        suitcase_id: newItem.suitcase_id,
        date: newItem.date,
        items: newItem.items,
        created_at: new Date().toISOString(),
      };

      // Store in our mock DB
      if (!mockCalendarItems[suitcaseId]) {
        mockCalendarItems[suitcaseId] = [];
      }
      mockCalendarItems[suitcaseId].push(newCalendarItem);

      return newCalendarItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcase-calendar-items', suitcaseId] });
      toast({
        title: "Calendrier mis à jour",
        description: "Votre planning a été mis à jour",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le calendrier",
        variant: "destructive",
      });
    }
  });

  const updateCalendarItem = useMutation({
    mutationFn: async ({
      id,
      items,
    }: {
      id: string;
      items: string[];
    }): Promise<SuitcaseCalendarItem> => {
      // Mock implementation
      if (!mockCalendarItems[suitcaseId]) {
        throw new Error('Calendar item not found');
      }

      const index = mockCalendarItems[suitcaseId].findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error('Calendar item not found');
      }

      const updatedItem = {
        ...mockCalendarItems[suitcaseId][index],
        items
      };

      mockCalendarItems[suitcaseId][index] = updatedItem;
      return updatedItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcase-calendar-items', suitcaseId] });
      toast({
        title: "Calendrier mis à jour",
        description: "Votre planning a été mis à jour",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le calendrier",
        variant: "destructive",
      });
    }
  });

  const removeCalendarItem = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      // Mock implementation
      if (!mockCalendarItems[suitcaseId]) {
        throw new Error('Calendar item not found');
      }

      const index = mockCalendarItems[suitcaseId].findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error('Calendar item not found');
      }

      mockCalendarItems[suitcaseId].splice(index, 1);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcase-calendar-items', suitcaseId] });
      toast({
        title: "Élément supprimé",
        description: "L'élément a été supprimé du calendrier",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément",
        variant: "destructive",
      });
    }
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addCalendarItem,
    updateCalendarItem,
    removeCalendarItem
  };
};
