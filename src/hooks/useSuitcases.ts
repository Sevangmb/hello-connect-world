
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Suitcase, SuitcaseFilter } from '@/components/suitcases/types';

const SUITCASES_QUERY_KEY = 'suitcases';

export function useSuitcases(userId: string) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<SuitcaseFilter>({
    status: 'active',
    search: '',
  });

  // Optimisation avec memoization de la fonction de fetch
  const fetchSuitcases = useCallback(async () => {
    let query = supabase
      .from('suitcases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Suitcase[];
  }, [userId, filters]);

  // Utilisation de staleTime plus élevé pour réduire les fetches inutiles
  const { data: suitcases = [], isLoading, error } = useQuery({
    queryKey: [SUITCASES_QUERY_KEY, userId, filters],
    queryFn: fetchSuitcases,
    staleTime: 10000, // 10 secondes
    keepPreviousData: true, // Garder les données précédentes pendant le chargement
  });

  // Memoization des valises pour éviter les re-renders inutiles
  const memoizedSuitcases = useMemo(() => suitcases, [suitcases]);

  // Optimisation du changement de filtres
  const applyFilters = useCallback((newFilters: Partial<SuitcaseFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Mutation pour créer une valise
  const createSuitcase = useCallback(async (data: Partial<Suitcase>) => {
    const { data: newSuitcase, error } = await supabase
      .from('suitcases')
      .insert({ ...data, user_id: userId })
      .select()
      .single();
      
    if (error) throw error;
    
    // Invalidation du cache pour mettre à jour l'UI
    queryClient.invalidateQueries({ queryKey: [SUITCASES_QUERY_KEY] });
    
    return newSuitcase as Suitcase;
  }, [userId, queryClient]);

  // Mutation pour mettre à jour une valise
  const updateSuitcase = useCallback(async (id: string, data: Partial<Suitcase>) => {
    const { data: updatedSuitcase, error } = await supabase
      .from('suitcases')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Invalidation du cache pour mettre à jour l'UI
    queryClient.invalidateQueries({ queryKey: [SUITCASES_QUERY_KEY] });
    
    return updatedSuitcase as Suitcase;
  }, [queryClient]);

  // Mutation pour supprimer une valise
  const deleteSuitcase = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('suitcases')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    // Invalidation du cache pour mettre à jour l'UI
    queryClient.invalidateQueries({ queryKey: [SUITCASES_QUERY_KEY] });
    
    return true;
  }, [queryClient]);

  // Fonction pour obtenir une valise par ID
  const getSuitcaseById = useCallback((id: string) => {
    return memoizedSuitcases.find(suitcase => suitcase.id === id);
  }, [memoizedSuitcases]);

  return {
    suitcases: memoizedSuitcases,
    loading: isLoading,
    error,
    filters,
    applyFilters,
    fetchSuitcases,
    createSuitcase,
    updateSuitcase,
    deleteSuitcase,
    getSuitcaseById
  };
}
