
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Suitcase } from '@/components/suitcases/types';

export function useSuitcase(suitcaseId: string) {
  const fetchSuitcase = useCallback(async () => {
    const { data, error } = await supabase
      .from('suitcases')
      .select('*')
      .eq('id', suitcaseId)
      .single();
      
    if (error) throw error;
    return data as Suitcase;
  }, [suitcaseId]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['suitcase', suitcaseId],
    queryFn: fetchSuitcase,
    staleTime: 10000,
    enabled: !!suitcaseId,
  });

  return { 
    suitcase: data, 
    loading: isLoading, 
    error 
  };
}
