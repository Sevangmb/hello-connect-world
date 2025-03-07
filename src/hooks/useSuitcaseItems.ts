import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseItem } from '@/components/suitcases/types';
import { useToast } from '@/hooks/use-toast';

const fetchSuitcaseItems = async (suitcaseId: string): Promise<SuitcaseItem[]> => {
  if (!suitcaseId) return [];

  const { data, error } = await supabase
    .from('suitcase_items')
    .select(`
      *,
      clothes:clothes_id (*)
    `)
    .eq('suitcase_id', suitcaseId);

  if (error) {
    console.error('Error fetching suitcase items:', error);
    throw new Error('Failed to fetch suitcase items');
  }

  // Add is_packed field with default value false
  return (data || []).map(item => ({
    ...item,
    is_packed: false // Default value since it doesn't exist in database
  })) as SuitcaseItem[];
};

export const useSuitcaseItems = (suitcaseId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['suitcase-items', suitcaseId],
    queryFn: () => fetchSuitcaseItems(suitcaseId),
    enabled: !!suitcaseId,
    staleTime: 60000,
  });

  const addItem = useMutation({
    mutationFn: async ({ 
      clothes_id, 
      quantity = 1,
      folder_id
    }: {
      clothes_id: string;
      quantity?: number;
      folder_id?: string;
    }) => {
      const item = {
        suitcase_id: suitcaseId,
        clothes_id,
        quantity,
        folder_id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('suitcase_items')
        .insert(item)
        .select()
        .single();

      if (error) {
        console.error('Error adding suitcase item:', error);
        throw new Error('Failed to add item to suitcase');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcase-items', suitcaseId] });
      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté à votre valise",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de l'ajout de l'article: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateItem = useMutation({
    mutationFn: async ({ 
      id, 
      quantity,
      folder_id,
      is_packed,
      notes
    }: {
      id: string;
      quantity?: number;
      folder_id?: string;
      is_packed?: boolean;
      notes?: string;
    }) => {
      const updates: any = {};
      if (quantity !== undefined) updates.quantity = quantity;
      if (folder_id !== undefined) updates.folder_id = folder_id;
      if (is_packed !== undefined) updates.is_packed = is_packed;
      if (notes !== undefined) updates.notes = notes;

      const { data, error } = await supabase
        .from('suitcase_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating suitcase item:', error);
        throw new Error('Failed to update item');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcase-items', suitcaseId] });
      toast({
        title: "Article mis à jour",
        description: "L'article a été mis à jour",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la mise à jour de l'article: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suitcase_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing suitcase item:', error);
        throw new Error('Failed to remove item');
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcase-items', suitcaseId] });
      toast({
        title: "Article supprimé",
        description: "L'article a été retiré de votre valise",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression de l'article: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    items: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addItem,
    updateItem,
    removeItem
  };
};
