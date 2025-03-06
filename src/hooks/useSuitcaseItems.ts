
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseItem } from '@/components/suitcases/utils/types';

export function useSuitcaseItems(suitcaseId: string) {
  const fetchSuitcaseItems = async (): Promise<SuitcaseItem[]> => {
    if (!suitcaseId) return [];
    
    const { data, error } = await supabase
      .from('suitcase_items')
      .select(`
        *,
        clothes:clothes_id (
          id, name, image_url, category, subcategory, color, size, brand, material
        )
      `)
      .eq('suitcase_id', suitcaseId);

    if (error) throw error;
    return data as SuitcaseItem[];
  };

  return useQuery({
    queryKey: ['suitcase-items', suitcaseId],
    queryFn: fetchSuitcaseItems,
    enabled: !!suitcaseId
  });
}
