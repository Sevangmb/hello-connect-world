import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/integrations/supabase/client';
import { Suitcase, SuitcaseFilter, SuitcaseStatus } from '@/components/suitcases/types';
import { useToast } from '@/hooks/use-toast';

const fetchSuitcases = async (userId: string, filter: SuitcaseFilter = {}): Promise<Suitcase[]> => {
  let query = supabase
    .from('suitcases')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (filter.status) {
    // Make sure we only use valid status values for database query
    // Database might only accept 'active' or 'archived'
    const validStatus = filter.status === 'active' || filter.status === 'archived' 
      ? filter.status 
      : 'active';
    query = query.eq('status', validStatus);
  }

  if (filter.search) {
    query = query.ilike('name', `%${filter.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching suitcases:', error);
    throw new Error('Failed to fetch suitcases');
  }

  return data as Suitcase[];
};

export const useSuitcases = (filter: SuitcaseFilter = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  getCurrentUser().then(user => {
    if (user?.id) {
      setUserId(user.id);
    }
  });

  const query = useQuery({
    queryKey: ['suitcases', userId, filter],
    queryFn: () => userId ? fetchSuitcases(userId, filter) : Promise.resolve([]),
    enabled: !!userId,
    staleTime: 60000,
  });

  const createSuitcase = useMutation({
    mutationFn: async (newSuitcase: {
      name: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      status?: SuitcaseStatus;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      // Only use 'active' or 'archived' when inserting to database
      // to match database constraints
      const dbStatus = newSuitcase.status === 'archived' ? 'archived' : 'active';

      const suitcaseData = {
        user_id: userId,
        name: newSuitcase.name,
        description: newSuitcase.description || '',
        start_date: newSuitcase.start_date,
        end_date: newSuitcase.end_date,
        status: dbStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('suitcases')
        .insert(suitcaseData)
        .select()
        .single();

      if (error) {
        console.error('Error creating suitcase:', error);
        throw new Error('Failed to create suitcase');
      }

      return data as Suitcase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcases'] });
      toast({
        title: "Valise créée",
        description: "Votre valise a été créée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la création de la valise: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateSuitcase = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      name?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      status?: 'active' | 'archived';
    }) => {
      const { data, error } = await supabase
        .from('suitcases')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating suitcase:', error);
        throw new Error('Failed to update suitcase');
      }

      return data as Suitcase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcases'] });
      toast({
        title: "Valise mise à jour",
        description: "Votre valise a été mise à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la mise à jour de la valise: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteSuitcase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suitcases')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting suitcase:', error);
        throw new Error('Failed to delete suitcase');
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcases'] });
      toast({
        title: "Valise supprimée",
        description: "Votre valise a été supprimée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression de la valise: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    suitcases: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createSuitcase,
    updateSuitcase,
    deleteSuitcase,
  };
};
