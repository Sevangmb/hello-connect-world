
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Suitcase, SuitcaseStatus } from './useSuitcases';

export interface SuitcaseCalendarItem {
  id: string;
  suitcase_id: string;
  date: string;
  created_at: string;
  updated_at: string;
  status: SuitcaseStatus;
  name?: string;
  description?: string;
}

export const useSuitcaseCalendarItems = (suitcaseId: string | undefined) => {
  const { toast } = useToast();
  const [items, setItems] = useState<SuitcaseCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = async () => {
    if (!suitcaseId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('suitcase_calendar_items')
        .select('*')
        .eq('suitcase_id', suitcaseId)
        .neq('status', 'deleted') // Filter out deleted items
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les éléments du calendrier',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (suitcaseId) {
      fetchItems();
    }
  }, [suitcaseId]);

  // Get items for a specific date
  const getItemsForDate = (date: string): SuitcaseCalendarItem[] => {
    return items.filter(item => item.date === date);
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    getItemsForDate
  };
};

// Add a convenience hook for getting items for a specific date
export const useSuitcaseCalendarItemsForDate = (suitcaseId: string | undefined, date: string) => {
  const { items, loading, error } = useSuitcaseCalendarItems(suitcaseId);
  const [dateItems, setDateItems] = useState<SuitcaseCalendarItem[]>([]);

  useEffect(() => {
    if (!date) {
      setDateItems([]);
      return;
    }
    
    const filteredItems = items.filter(item => item.date === date);
    setDateItems(filteredItems);
  }, [items, date]);

  return {
    items: dateItems,
    loading,
    error
  };
};
