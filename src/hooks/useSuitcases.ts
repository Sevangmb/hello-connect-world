
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Suitcase, SuitcaseFilter } from '@/components/suitcases/types';

export function useSuitcases(userId: string) {
  const [filters, setFilters] = useState<SuitcaseFilter>({
    status: 'active',
    search: '',
  });

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

  const { data: suitcases = [], isLoading, error } = useQuery({
    queryKey: ['suitcases', userId, filters],
    queryFn: fetchSuitcases,
    staleTime: 5000, // Éviter les re-fetch trop fréquents
  });

  const memoizedSuitcases = useMemo(() => suitcases, [suitcases]);

  const applyFilters = useCallback((newFilters: SuitcaseFilter) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    suitcases: memoizedSuitcases,
    loading: isLoading,
    error,
    filters,
    applyFilters,
  };
}
