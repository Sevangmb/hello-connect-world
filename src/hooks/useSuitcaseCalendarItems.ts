
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseCalendarItem } from '@/components/suitcases/utils/types';

export const useSuitcaseCalendarItems = (suitcaseId: string, dateFilter?: string) => {
  const [items, setItems] = useState<SuitcaseCalendarItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('suitcase_items')
          .select(`
            id, 
            suitcase_id, 
            clothes_id, 
            quantity,
            created_at,
            clothes (
              id, 
              name, 
              image_url, 
              category
            )
          `)
          .eq('suitcase_id', suitcaseId);
        
        // Add date filter if provided
        if (dateFilter) {
          // This assumes there's a date column or we need to join with a table that has dates
          // Adjust based on your actual schema
          query = query.eq('date', dateFilter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Map the data to SuitcaseCalendarItem structure
        const mappedItems = data.map(item => ({
          id: item.id,
          suitcase_id: item.suitcase_id,
          clothes_id: item.clothes_id,
          quantity: item.quantity,
          created_at: item.created_at,
          date: dateFilter || new Date().toISOString().split('T')[0], // Use dateFilter or today
          clothes: item.clothes
        }));
        
        setItems(mappedItems);
      } catch (err) {
        console.error('Error fetching suitcase calendar items:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    if (suitcaseId) {
      fetchItems();
    }
  }, [suitcaseId, dateFilter]);

  return { items, loading, error };
};

// Add a specialized hook for fetching items by date
export const useSuitcaseCalendarItemsForDate = (suitcaseId: string, date: string) => {
  return useSuitcaseCalendarItems(suitcaseId, date);
};
