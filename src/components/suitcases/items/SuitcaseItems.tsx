
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SuitcaseItemsEmpty } from './SuitcaseItemsEmpty';
import { SuitcaseItemsHeader } from './SuitcaseItemsHeader';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseItem } from '@/components/suitcases/utils/types';

interface SuitcaseItemsProps {
  suitcaseId: string;
}

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ suitcaseId }) => {
  const queryClient = useQueryClient();
  
  // Use query to fetch items
  const { data: items, isLoading } = useQuery<SuitcaseItem[]>({
    queryKey: ['suitcase-items', suitcaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suitcase_items')
        .select('*, clothes(*)')
        .eq('suitcase_id', suitcaseId);
      
      if (error) throw error;
      return data as SuitcaseItem[];
    }
  });
  
  // Mutation for removing items
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('suitcase_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      return itemId;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['suitcase-items', suitcaseId] });
    }
  });

  // Initialize an empty array for available clothes
  const availableClothes = [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!items?.length) {
    return (
      <SuitcaseItemsEmpty 
        suitcaseId={suitcaseId}
        availableClothes={availableClothes}
      />
    );
  }

  return (
    <div>
      <SuitcaseItemsHeader 
        itemCount={items.length} 
        isLoading={isLoading} 
      />
      <ul className="space-y-2 mt-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-2 border rounded-md">
            <span>{item.clothes?.name || 'Item sans nom'}</span>
            <button 
              onClick={() => removeItemMutation.mutate(item.id)}
              className="text-red-500 text-sm"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
