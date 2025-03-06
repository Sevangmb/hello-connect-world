
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Suitcase } from "./useSuitcases";

export interface CalendarItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  suitcaseId: string;
}

export const useSuitcaseCalendarItems = () => {
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCalendarItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("suitcases")
        .select("*")
        .not("start_date", "is", null)
        .not("status", "eq", "deleted");
      
      if (error) throw error;
      
      const items: CalendarItem[] = [];
      
      if (data) {
        data.forEach((suitcase: Suitcase) => {
          if (suitcase.start_date) {
            items.push({
              id: suitcase.id,
              title: suitcase.name,
              start: new Date(suitcase.start_date),
              end: new Date(suitcase.end_date || suitcase.start_date),
              allDay: true,
              suitcaseId: suitcase.id
            });
          }
        });
      }
      
      setCalendarItems(items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const addCalendarItem = async (data: { 
    name: string;
    start_date: string; 
    end_date?: string;
    user_id: string;
  }) => {
    try {
      const { data: newItem, error } = await supabase
        .from("suitcases")
        .insert([{
          name: data.name,
          start_date: data.start_date,
          end_date: data.end_date,
          user_id: data.user_id,
          status: "active"
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const calendarItem: CalendarItem = {
        id: newItem.id,
        title: newItem.name,
        start: new Date(newItem.start_date),
        end: new Date(newItem.end_date || newItem.start_date),
        allDay: true,
        suitcaseId: newItem.id
      };
      
      setCalendarItems([...calendarItems, calendarItem]);
      return calendarItem;
    } catch (err) {
      throw err instanceof Error ? err : new Error('An unknown error occurred');
    }
  };

  useEffect(() => {
    fetchCalendarItems();
  }, []);

  return {
    calendarItems,
    isLoading,
    error,
    fetchCalendarItems,
    addCalendarItem
  };
};
