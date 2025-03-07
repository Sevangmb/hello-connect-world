
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSuitcase } from '@/hooks/useSuitcase';
import { Card } from '@/components/ui/card';
import SuitcaseCalendarComponent from '@/components/suitcases/components/SuitcaseCalendar';
import { Skeleton } from '@/components/ui/skeleton';

const SuitcaseCalendar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { suitcase, loading, error } = useSuitcase(id);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Button 
          variant="outline" 
          className="mb-4"
          disabled
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la valise
        </Button>
        
        <Skeleton className="h-8 w-64 mb-4" />
        <Card className="p-6">
          <Skeleton className="h-96 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !suitcase) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => navigate(`/suitcases`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux valises
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error?.message || 'Valise non trouvée'}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => navigate(`/suitcases/${id}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la valise
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">
        Calendrier de {suitcase.name}
      </h1>
      
      <Card className="p-6">
        <SuitcaseCalendarComponent 
          suitcaseId={suitcase.id} 
          startDate={suitcase.start_date} 
          endDate={suitcase.end_date}
        />
      </Card>
    </div>
  );
};

export default SuitcaseCalendar;
