
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Interface pour le type Suitcase
export interface Suitcase {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  user_id: string;
  status: 'active' | 'archived' | 'completed';
  created_at: string;
  updated_at: string;
}

// Interface pour les données de création d'une valise
export interface CreateSuitcaseData {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

// Hook principal pour gérer les valises
export const useSuitcases = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Récupération de toutes les valises de l'utilisateur
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['suitcases'],
    queryFn: async () => {
      const { data: suitcases, error } = await supabase
        .from('suitcases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        throw error;
      }

      return suitcases as Suitcase[];
    }
  });

  // Création d'une nouvelle valise
  const mutateAsync = async (suitcaseData: CreateSuitcaseData) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: newSuitcase, error } = await supabase
        .from('suitcases')
        .insert({
          name: suitcaseData.name,
          description: suitcaseData.description || null,
          start_date: suitcaseData.start_date || null,
          end_date: suitcaseData.end_date || null,
          user_id: userData.user.id,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        setError(error.message);
        throw error;
      }

      // Mettre à jour le cache
      queryClient.invalidateQueries({ queryKey: ['suitcases'] });
      return newSuitcase as Suitcase;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createSuitcase = useMutation({
    mutationFn: mutateAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcases'] });
    }
  });

  return {
    data,
    isLoading,
    isError,
    error,
    mutateAsync,
    createSuitcase,
    refetch
  };
};

// Hook pour gérer une valise spécifique
export const useSuitcase = (suitcaseId: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['suitcase', suitcaseId],
    queryFn: async () => {
      const { data: suitcase, error } = await supabase
        .from('suitcases')
        .select('*')
        .eq('id', suitcaseId)
        .single();

      if (error) {
        setError(error.message);
        throw error;
      }

      return suitcase as Suitcase;
    },
    enabled: !!suitcaseId
  });

  // Mise à jour d'une valise
  const updateSuitcase = useMutation({
    mutationFn: async (updatedData: Partial<Suitcase>) => {
      const { data: updatedSuitcase, error } = await supabase
        .from('suitcases')
        .update(updatedData)
        .eq('id', suitcaseId)
        .select()
        .single();

      if (error) {
        setError(error.message);
        throw error;
      }

      return updatedSuitcase as Suitcase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcase', suitcaseId] });
      queryClient.invalidateQueries({ queryKey: ['suitcases'] });
    }
  });

  // Suppression d'une valise
  const deleteSuitcase = useMutation({
    mutationFn: async () => {
      // D'abord supprimer les éléments liés à la valise (pour respecter les contraintes de clé étrangère)
      await supabase
        .from('suitcase_items')
        .delete()
        .eq('suitcase_id', suitcaseId);

      // Puis supprimer la valise elle-même
      const { error } = await supabase
        .from('suitcases')
        .delete()
        .eq('id', suitcaseId);

      if (error) {
        setError(error.message);
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcases'] });
    }
  });

  return {
    data,
    isLoading,
    isError,
    error,
    updateSuitcase,
    deleteSuitcase
  };
};
