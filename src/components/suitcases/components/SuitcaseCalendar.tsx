
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SuitcaseCalendarItemsList } from './SuitcaseCalendarItemsList';
import { useSuitcaseCalendarItems } from '@/hooks/useSuitcaseCalendarItems';
import { Suitcase } from '@/hooks/useSuitcases';

interface SuitcaseCalendarProps {
  suitcaseId: string;
  suitcase?: Suitcase;
}

export const SuitcaseCalendar = ({ suitcaseId, suitcase }: SuitcaseCalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { items, loading } = useSuitcaseCalendarItems(suitcaseId);
  
  // Function to get dates with items
  const getDatesWithItems = () => {
    const dates = new Set<string>();
    
    items.forEach(item => {
      dates.add(item.date);
    });
    
    return Array.from(dates).map(dateStr => new Date(dateStr));
  };
  
  const datesWithItems = getDatesWithItems();
  
  // Navigate months
  const nextMonth = () => {
    setDate(addMonths(date, 1));
  };
  
  const prevMonth = () => {
    setDate(subMonths(date, 1));
  };
  
  // Format date for display in the header
  const formattedDate = format(date, 'MMMM yyyy', { locale: fr });
  
  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
  };
  
  // Get formatted selected date for display
  const formattedSelectedDate = selectedDate 
    ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr }) 
    : null;
  
  // Check if a given date has items
  const dateHasItems = (date: Date): boolean => {
    return datesWithItems.some(d => 
      format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };
  
  // Format selected date for items list
  const selectedDateFormatted = selectedDate 
    ? format(selectedDate, 'yyyy-MM-dd') 
    : null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4 md:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-lg font-medium capitalize">{formattedDate}</h3>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={date}
          className="rounded-md border"
          modifiers={{
            booked: datesWithItems
          }}
          modifiersClassNames={{
            booked: 'bg-blue-100 font-bold text-blue-700'
          }}
        />
        
        {suitcase && (
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center mb-2">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>Valise: {suitcase.name}</span>
            </div>
            {suitcase.start_date && suitcase.end_date && (
              <div className="text-xs">
                Du {new Date(suitcase.start_date).toLocaleDateString()} au {new Date(suitcase.end_date).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </Card>
      
      <Card className="p-4 md:col-span-2">
        {formattedSelectedDate ? (
          <>
            <h3 className="text-lg font-medium capitalize mb-4">
              {formattedSelectedDate}
            </h3>
            
            {selectedDateFormatted && (
              <SuitcaseCalendarItemsList 
                suitcaseId={suitcaseId} 
                date={selectedDateFormatted}
                onItemsChanged={() => {}} 
              />
            )}
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Sélectionnez une date pour voir les détails
          </div>
        )}
      </Card>
    </div>
  );
};
