
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SuitcaseCalendarItemsList } from './SuitcaseCalendarItemsList';
import { SuitcaseCalendarItem } from '../types';

interface SuitcaseCalendarProps {
  items: SuitcaseCalendarItem[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export const SuitcaseCalendar: React.FC<SuitcaseCalendarProps> = ({
  items,
  onDateSelect,
  selectedDate
}) => {
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
            onSelect={(date) => date && onDateSelect(date)}
            className="rounded-md border shadow"
            highlightedDays={itemDates}
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
