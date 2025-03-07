
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Suitcase } from '@/components/suitcases/types';

const fetchSuitcase = async (id: string): Promise<Suitcase | undefined> => {
  if (!id) return undefined;

  const { data, error } = await supabase
    .from('suitcases')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching suitcase:', error);
    throw new Error(`Failed to fetch suitcase: ${error.message}`);
  }

  return data as Suitcase;
};

export const useSuitcase = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['suitcase', id],
    queryFn: () => fetchSuitcase(id),
    enabled: !!id,
    staleTime: 60000,
  });

  return {
    suitcase: data,
    loading: isLoading,
    error: error as Error,
  };
};
