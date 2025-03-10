
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SuitcaseCalendarItemsList } from './SuitcaseCalendarItemsList';
import { SuitcaseCalendarItem } from '../types';
import { supabase } from '@/integrations/supabase/client';

interface SuitcaseCalendarProps {
  items?: SuitcaseCalendarItem[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  suitcaseId: string;
  startDate?: string | null;
  endDate?: string | null;
}

export const SuitcaseCalendar: React.FC<SuitcaseCalendarProps> = ({
  items: propItems,
  onDateSelect,
  selectedDate: propSelectedDate,
  suitcaseId,
  startDate,
  endDate
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(propSelectedDate);
  const [items, setItems] = useState<SuitcaseCalendarItem[]>(propItems || []);
  const [loading, setLoading] = useState(!propItems);
  
  useEffect(() => {
    if (!propItems && suitcaseId) {
      fetchCalendarItems();
    }
  }, [suitcaseId, propItems]);
  
  const fetchCalendarItems = async () => {
    try {
      setLoading(true);
      // Logic to fetch calendar items from the database
      // For now, we're using an empty array as placeholder
      setItems([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar items:', error);
      setLoading(false);
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };
  
  const itemDates = items.map(item => new Date(item.date));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier de voyage</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border shadow"
            modifiers={{
              highlighted: itemDates
            }}
            modifiersStyles={{
              highlighted: { fontWeight: 'bold', backgroundColor: 'rgba(59, 130, 246, 0.1)' }
            }}
          />
        </div>
        <div className="md:w-1/2">
          {selectedDate && (
            <SuitcaseCalendarItemsList
              selectedDate={selectedDate}
              items={items.find(item => item.date === selectedDate.toISOString().split('T')[0])?.items || []}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuitcaseCalendar;
