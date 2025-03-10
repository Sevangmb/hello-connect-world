
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseCalendarItem, SuitcaseItem } from '@/components/suitcases/types';

export const useSuitcaseCalendarItems = (suitcaseId: string) => {
  const [items, setItems] = useState<SuitcaseCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (!suitcaseId) return;
    
    const fetchCalendarItems = async () => {
      try {
        setLoading(true);
        
        // Fetch suitcase items
        const { data: suitcaseItems, error: itemsError } = await supabase
          .from('suitcase_items')
          .select(`
            id,
            suitcase_id,
            clothes_id,
            quantity,
            calendar_date,
            clothes (
              id,
              name,
              image_url,
              category,
              color
            )
          `)
          .eq('suitcase_id', suitcaseId);
        
        if (itemsError) throw itemsError;
        
        // Group items by date
        const itemsByDate: Record<string, SuitcaseItem[]> = {};
        
        suitcaseItems?.forEach((item: any) => {
          // Use the calendar_date if it exists, otherwise spread across all dates
          const date = item.calendar_date ? item.calendar_date : new Date().toISOString().split('T')[0];
          
          if (!itemsByDate[date]) {
            itemsByDate[date] = [];
          }
          
          itemsByDate[date].push({
            id: item.id,
            suitcase_id: item.suitcase_id,
            clothes_id: item.clothes_id,
            quantity: item.quantity,
            clothes: item.clothes
          });
        });
        
        // Convert to SuitcaseCalendarItem array
        const calendarItems: SuitcaseCalendarItem[] = Object.keys(itemsByDate).map(date => ({
          id: `calendar-item-${date}`,
          date,
          items: itemsByDate[date]
        }));
        
        setItems(calendarItems);
      } catch (err) {
        console.error('Error fetching calendar items:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch calendar items'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCalendarItems();
  }, [suitcaseId]);
  
  const onDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  return {
    items,
    loading,
    error,
    selectedDate,
    onDateSelect
  };
};

export default useSuitcaseCalendarItems;
