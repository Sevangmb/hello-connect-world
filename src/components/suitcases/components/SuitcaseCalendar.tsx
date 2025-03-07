
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Suitcase } from '../types';
import { SuitcaseCalendarItemsList } from './SuitcaseCalendarItemsList';

interface SuitcaseCalendarProps {
  suitcaseId: string;
  suitcase: Suitcase | undefined;
  loading: boolean;
  error: Error | null;
}

export const SuitcaseCalendar: React.FC<SuitcaseCalendarProps> = ({ 
  suitcaseId, 
  suitcase,
  loading,
  error 
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  if (loading) {
    return <Card><CardContent className="p-6">Chargement du calendrier...</CardContent></Card>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement du calendrier: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Articles pour {selectedDate?.toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate && (
            <SuitcaseCalendarItemsList 
              suitcaseId={suitcaseId} 
              date={selectedDate.toISOString().split('T')[0]} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
