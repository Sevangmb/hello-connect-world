
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { SuitcaseCalendar as CalendarComponent } from '@/components/suitcases/components/SuitcaseCalendar';
import { useSuitcase } from '@/hooks/useSuitcase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function SuitcaseCalendar() {
  const { id } = useParams<{ id: string }>();
  const { suitcase, loading, error } = useSuitcase(id || '');

  if (!id) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          ID de valise manquant. Veuillez sélectionner une valise.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <Card><CardContent className="p-6">Chargement des données...</CardContent></Card>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement de la valise: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">
        Calendrier: {suitcase?.name || 'Valise'}
      </h1>
      <CalendarComponent 
        suitcaseId={id} 
        suitcase={suitcase}
        loading={loading}
        error={error}
      />
    </div>
  );
}
