
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseItem } from '@/components/suitcases/types';

export function useSuitcaseItems(suitcaseId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['suitcase-items', suitcaseId];

  const fetchItems = useCallback(async () => {
    if (!suitcaseId) return [];
    
    const { data, error } = await supabase
      .from('suitcase_items')
      .select('*, clothes(*)')
      .eq('suitcase_id', suitcaseId);
      
    if (error) throw error;
    return data as SuitcaseItem[];
  }, [suitcaseId]);

  const { data = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchItems,
    staleTime: 10000,
    enabled: !!suitcaseId,
  });

  const addItem = useMutation({
    mutationFn: async (newItem: Omit<SuitcaseItem, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('suitcase_items')
        .insert({
          ...newItem,
          suitcase_id: suitcaseId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...changes }: Partial<SuitcaseItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('suitcase_items')
        .update({
          ...changes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suitcase_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  return {
    items: data,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem
  };
}
