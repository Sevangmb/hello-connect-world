
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { useSuitcase } from '@/hooks/useSuitcase';
import { SuitcaseCalendarItemsList } from './SuitcaseCalendarItemsList';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface SuitcaseCalendarProps {
  suitcaseId: string;
}

export const SuitcaseCalendar: React.FC<SuitcaseCalendarProps> = ({ suitcaseId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { data: suitcase, isLoading } = useSuitcase(suitcaseId);
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Function to calculate date range for suitcase
  const getDateRange = () => {
    if (!suitcase?.start_date || !suitcase?.end_date) return undefined;
    
    const startDate = new Date(suitcase.start_date);
    const endDate = new Date(suitcase.end_date);
    
    return {
      from: startDate,
      to: endDate
    };
  };

  // Function to handle refresh of items
  const handleItemsChanged = () => {
    // You can implement refresh logic here if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h3 className="text-lg font-medium mb-4">Date du voyage</h3>
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              className="rounded-md border"
              locale={fr}
              disabled={{
                before: suitcase?.start_date ? new Date(suitcase.start_date) : undefined,
                after: suitcase?.end_date ? new Date(suitcase.end_date) : undefined
              }}
              defaultMonth={suitcase?.start_date ? new Date(suitcase.start_date) : undefined}
              initialFocus
            />
          </Card>
        </div>
        
        <div className="md:w-1/2">
          <h3 className="text-lg font-medium mb-4">
            {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Sélectionnez une date'}
          </h3>
          <Card className="min-h-[300px]">
            {selectedDate && (
              <SuitcaseCalendarItemsList
                suitcaseId={suitcaseId}
                date={formatDate(selectedDate)}
                onItemsChanged={handleItemsChanged}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
