
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

export interface SuitcaseCalendarProps {
  suitcaseId: string;
  startDate?: string;
  endDate?: string;
}

export const SuitcaseCalendar: React.FC<SuitcaseCalendarProps> = ({
  suitcaseId,
  startDate,
  endDate
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  // Mettre à jour la plage de dates quand les props changent
  useEffect(() => {
    if (startDate || endDate) {
      setDateRange({
        from: startDate ? new Date(startDate) : undefined,
        to: endDate ? new Date(endDate) : undefined,
      });
    }
  }, [startDate, endDate]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Calendrier de voyage</h3>
        
        {dateRange.from && dateRange.to && (
          <div className="text-sm text-gray-600">
            {format(dateRange.from, 'dd MMM', { locale: fr })} - {format(dateRange.to, 'dd MMM yyyy', { locale: fr })}
          </div>
        )}
      </div>
      
      <div className="border rounded-md p-4 bg-white">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          locale={fr}
          disabled={{ before: new Date('2020-01-01') }}
          className="mx-auto"
        />
      </div>
      
      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            toast({
              title: "Planification en cours de développement",
              description: "Cette fonctionnalité sera bientôt disponible.",
            });
          }}
        >
          Planifier les vêtements par jour
        </Button>
      </div>
    </div>
  );
};

export default SuitcaseCalendar;
