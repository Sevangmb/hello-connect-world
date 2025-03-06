
import React from 'react';
import { useParams } from 'react-router-dom';
import { SuitcaseCalendar } from '@/components/suitcases/components/SuitcaseCalendar';
import { useSuitcases } from '@/hooks/useSuitcases';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const SuitcaseCalendarPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getSuitcaseById, loading } = useSuitcases();
  
  const suitcase = id ? getSuitcaseById(id) : null;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!suitcase || !id) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">Valise non trouvée</h2>
          <p className="text-muted-foreground mt-2">La valise que vous recherchez n'existe pas ou a été supprimée.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Calendrier: {suitcase.name}</h1>
      <SuitcaseCalendar suitcaseId={id} suitcase={suitcase} />
    </div>
  );
};

export default SuitcaseCalendarPage;
