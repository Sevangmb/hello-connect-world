
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { addDays, format, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SuitcaseCalendarProps {
  suitcaseId: string;
  startDate?: string | null;
  endDate?: string | null;
}

export const SuitcaseCalendar: React.FC<SuitcaseCalendarProps> = ({
  suitcaseId,
  startDate,
  endDate
}) => {
  const [date, setDate] = useState<Date | undefined>(
    startDate ? parseISO(startDate) : new Date()
  );

  // Créer un intervalle de date si les dates de début et de fin sont définies
  const tripInterval = (startDate && endDate) 
    ? { 
        start: parseISO(startDate), 
        end: parseISO(endDate) 
      } 
    : null;
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'PPPP', { locale: fr });
  };

  // Déterminer si un jour donné est pendant le voyage
  const isDuringTrip = (day: Date) => {
    if (!tripInterval) return false;
    return isWithinInterval(day, tripInterval);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Calendrier du voyage</CardTitle>
              <CardDescription>
                {tripInterval ? (
                  <>
                    <span className="font-medium text-foreground">
                      {format(tripInterval.start, 'PPP', { locale: fr })}
                    </span>
                    {' - '}
                    <span className="font-medium text-foreground">
                      {format(tripInterval.end, 'PPP', { locale: fr })}
                    </span>
                    <p className="text-sm mt-1">
                      {Math.ceil((tripInterval.end.getTime() - tripInterval.start.getTime()) / (1000 * 60 * 60 * 24) + 1)} jours
                    </p>
                  </>
                ) : (
                  'Aucune date définie pour ce voyage'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => {
                  if (!tripInterval) return false;
                  return !isWithinInterval(date, {
                    start: addDays(tripInterval.start, -7), 
                    end: addDays(tripInterval.end, 7)
                  });
                }}
                modifiers={{
                  trip: (date) => isDuringTrip(date)
                }}
                modifiersClassNames={{
                  trip: 'bg-primary text-primary-foreground font-medium'
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-64">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Infos du jour</CardTitle>
              <CardDescription>
                {date ? format(date, 'PPPP', { locale: fr }) : 'Aucune date sélectionnée'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {date && isDuringTrip(date) ? (
                <>
                  <Badge className="mb-2">Jour du voyage</Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    Jour {Math.ceil((date.getTime() - parseISO(startDate!).getTime()) / (1000 * 60 * 60 * 24) + 1)} sur {Math.ceil((parseISO(endDate!).getTime() - parseISO(startDate!).getTime()) / (1000 * 60 * 60 * 24) + 1)}
                  </p>
                  {/* Ici, on pourrait ajouter des suggestions de tenues pour ce jour */}
                </>
              ) : date ? (
                <p className="text-sm text-muted-foreground">
                  Cette date est {isDuringTrip(date) ? 'pendant' : 'en dehors de'} votre voyage.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sélectionnez une date pour voir les détails.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
