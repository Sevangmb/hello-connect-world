
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Suitcase } from './useSuitcases';

export function useSuitcase(suitcaseId: string) {
  const fetchSuitcase = async (): Promise<Suitcase> => {
    const { data, error } = await supabase
      .from('suitcases')
      .select('*')
      .eq('id', suitcaseId)
      .single();

    if (error) throw error;
    return data as Suitcase;
  };

  return useQuery({
    queryKey: ['suitcase', suitcaseId],
    queryFn: fetchSuitcase,
    enabled: !!suitcaseId
  });
}
