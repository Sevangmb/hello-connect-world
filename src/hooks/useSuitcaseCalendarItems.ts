
import { useState, useEffect } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseCalendarItem } from '@/components/suitcases/utils/types';

// Adding a missing export for useSuitcaseCalendar that was referenced elsewhere
export const useSuitcaseCalendar = (suitcaseId: string) => {
  return useQuery({
    queryKey: ['suitcase-calendar', suitcaseId],
    queryFn: async () => {
      return { suitcaseId };
    },
    enabled: !!suitcaseId
  });
};

// Adding a missing export for useSuitcaseCalendarItemsForDate
export const useSuitcaseCalendarItemsForDate = (suitcaseId: string, date: string) => {
  return useSuitcaseCalendarItems(suitcaseId, date);
};

export const useSuitcaseCalendarItems = (
  suitcaseId: string,
  date?: string
): UseQueryResult<SuitcaseCalendarItem[]> => {
  const fetchCalendarItems = async (): Promise<SuitcaseCalendarItem[]> => {
    try {
      const query = supabase
        .from('suitcase_items')
        .select(`
          id,
          suitcase_id,
          clothes_id,
          quantity,
          created_at,
          clothes:clothes_id (
            id, name, image_url, category
          ),
          suitcases:suitcase_id (
            name, start_date, end_date
          )
        `)
        .eq('suitcase_id', suitcaseId);

      // Apply date filter if provided
      if (date) {
        query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match SuitcaseCalendarItem type
      return (data || []).map((item: any) => ({
        ...item,
        date: date || new Date().toISOString().split('T')[0]
      })) as SuitcaseCalendarItem[];
    } catch (error) {
      console.error('Error fetching calendar items:', error);
      return [];
    }
  };

  return useQuery({
    queryKey: ['suitcase-calendar-items', suitcaseId, date],
    queryFn: fetchCalendarItems,
    enabled: !!suitcaseId
  });
};
