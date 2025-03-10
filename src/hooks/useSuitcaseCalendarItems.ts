
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseCalendarItem, SuitcaseItem } from '@/components/suitcases/types';

export const useSuitcaseCalendarItems = (suitcaseId: string) => {
  const [items, setItems] = useState<SuitcaseCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!suitcaseId) {
      setLoading(false);
      return;
    }

    const fetchCalendarItems = async () => {
      try {
        setLoading(true);
        
        // Fetch suitcase items with their clothes details
        const { data: suitcaseItems, error: itemsError } = await supabase
          .from('suitcase_items')
          .select(`
            id,
            suitcase_id,
            clothes_id,
            quantity,
            folder_id,
            created_at,
            day_assigned,
            clothes (
              name,
              image_url,
              category,
              color
            )
          `)
          .eq('suitcase_id', suitcaseId);
        
        if (itemsError) throw itemsError;
        
        // Group items by date
        const groupedItems: Record<string, SuitcaseItem[]> = {};
        
        suitcaseItems.forEach((item: any) => {
          if (item.day_assigned) {
            const dateStr = item.day_assigned;
            if (!groupedItems[dateStr]) {
              groupedItems[dateStr] = [];
            }
            groupedItems[dateStr].push(item);
          }
        });
        
        // Convert to calendar items format
        const calendarItems: SuitcaseCalendarItem[] = Object.keys(groupedItems).map(date => ({
          id: `${suitcaseId}-${date}`,
          date,
          items: groupedItems[date]
        }));
        
        setItems(calendarItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching calendar items:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarItems();
  }, [suitcaseId]);

  return { items, loading, error };
};

export default useSuitcaseCalendarItems;
