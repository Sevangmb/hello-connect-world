
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { addDays, format, parseISO } from 'date-fns';
import { SuitcaseCalendarItem, SuitcaseItem } from '@/components/suitcases/types';

export const useSuitcaseCalendarItems = (
  suitcaseId: string,
  startDate?: string,
  endDate?: string
) => {
  const [calendarItems, setCalendarItems] = useState<SuitcaseCalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!suitcaseId) {
      setIsLoading(false);
      return;
    }

    const fetchSuitcaseItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all items for this suitcase
        const { data: itemsData, error: itemsError } = await supabase
          .from('suitcase_items')
          .select(`
            *,
            clothes (
              id, name, image_url, category, color, brand
            )
          `)
          .eq('suitcase_id', suitcaseId);

        if (itemsError) throw itemsError;

        // Make sure we have valid dates
        let start = startDate ? parseISO(startDate) : new Date();
        let end = endDate ? parseISO(endDate) : addDays(start, 7);

        // If end date is before start date, swap them
        if (end < start) {
          const temp = start;
          start = end;
          end = temp;
        }

        // Create a calendar day for each day in the range
        const days: SuitcaseCalendarItem[] = [];
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = format(currentDate, 'yyyy-MM-dd');
          
          days.push({
            id: `day-${formattedDate}`,
            date: formattedDate,
            items: itemsData as SuitcaseItem[] || [],
            outfits: []
          });
          
          currentDate = addDays(currentDate, 1);
        }

        setCalendarItems(days);
      } catch (error: any) {
        console.error('Error fetching suitcase calendar items:', error);
        setError(error.message || 'Failed to load suitcase items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuitcaseItems();
  }, [suitcaseId, startDate, endDate]);

  // Function to assign an item to a specific day
  const assignItemToDay = (itemId: string, dayDate: string) => {
    setCalendarItems(current => {
      return current.map(day => {
        if (day.date === dayDate) {
          // Find the item in our collection
          const allItems = current.flatMap(d => d.items);
          const itemToAssign = allItems.find(item => item.id === itemId);
          
          if (itemToAssign) {
            // Check if the item is already in this day
            const isAlreadyAssigned = day.items.some(item => item.id === itemId);
            
            if (!isAlreadyAssigned) {
              // Add the item to this day
              return {
                ...day,
                items: [...day.items, itemToAssign]
              };
            }
          }
        }
        return day;
      });
    });
  };

  // Function to remove an item from a specific day
  const removeItemFromDay = (itemId: string, dayDate: string) => {
    setCalendarItems(current => {
      return current.map(day => {
        if (day.date === dayDate) {
          return {
            ...day,
            items: day.items.filter(item => item.id !== itemId)
          };
        }
        return day;
      });
    });
  };

  return { 
    calendarItems, 
    isLoading, 
    error,
    assignItemToDay,
    removeItemFromDay
  };
};

export default useSuitcaseCalendarItems;
