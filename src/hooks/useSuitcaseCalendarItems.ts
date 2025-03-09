
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseCalendarItem, SuitcaseItem } from '@/components/suitcases/types';

export const useSuitcaseCalendarItems = (suitcaseId: string) => {
  const [items, setItems] = useState<SuitcaseCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCalendarItems = async () => {
      try {
        setLoading(true);
        
        // Fetch the suitcase details first to get date range
        const { data: suitcase, error: suitcaseError } = await supabase
          .from('suitcases')
          .select('*')
          .eq('id', suitcaseId)
          .single();
        
        if (suitcaseError) throw suitcaseError;
        
        if (!suitcase.start_date || !suitcase.end_date) {
          setItems([]);
          return;
        }
        
        // Fetch all items for this suitcase
        const { data: itemsData, error: itemsError } = await supabase
          .from('suitcase_items')
          .select(`
            *,
            clothes:clothes_id (
              name,
              image_url,
              category,
              color
            )
          `)
          .eq('suitcase_id', suitcaseId);
        
        if (itemsError) throw itemsError;
        
        // Create calendar structure
        const start = new Date(suitcase.start_date);
        const end = new Date(suitcase.end_date);
        const calendar: SuitcaseCalendarItem[] = [];
        
        // For simplicity, distribute items evenly across the date range
        const itemsPerDay = Math.max(1, Math.ceil(itemsData.length / getDaysBetween(start, end)));
        let currentItemIndex = 0;
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          const dayItems: SuitcaseItem[] = [];
          
          // Assign some items to this day
          for (let i = 0; i < itemsPerDay && currentItemIndex < itemsData.length; i++) {
            dayItems.push(itemsData[currentItemIndex]);
            currentItemIndex++;
          }
          
          calendar.push({
            id: dateString,
            date: dateString,
            items: dayItems
          });
        }
        
        setItems(calendar);
        
        // Set initial selected date to start date
        if (calendar.length > 0 && !selectedDate) {
          setSelectedDate(start);
        }
        
      } catch (error) {
        console.error("Error fetching calendar items:", error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: "Impossible de charger le calendrier de la valise"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (suitcaseId) {
      fetchCalendarItems();
    }
    
  }, [suitcaseId, toast]);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  return {
    items,
    loading,
    selectedDate,
    onDateSelect: handleDateSelect
  };
};

function getDaysBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}
