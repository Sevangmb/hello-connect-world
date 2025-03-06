
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSuitcase } from '@/hooks/useSuitcase';
import { SuitcaseCalendar } from '@/components/suitcases/components/SuitcaseCalendar';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const SuitcaseCalendarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: suitcase, isLoading } = useSuitcase(id || '');

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!suitcase) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            Valise non trouvée
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Calendrier: {suitcase.name}</h1>
      <Card className="p-6">
        <SuitcaseCalendar suitcaseId={suitcase.id} />
      </Card>
    </div>
  );
};

export default SuitcaseCalendarPage;
