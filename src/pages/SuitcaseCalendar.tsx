
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import SuitcaseCalendar from '@/components/suitcases/components/SuitcaseCalendar';
import { useSuitcaseCalendarItems } from '@/hooks/useSuitcaseCalendarItems';
import { useToast } from '@/hooks/use-toast';

const SuitcaseCalendarPage = () => {
  const { id } = useParams<{ id: string }>();
  const { items, loading, selectedDate, onDateSelect } = useSuitcaseCalendarItems(id || '');
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!id) {
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: "ID de valise manquant"
    });
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
          <CardDescription>Impossible de charger le calendrier de la valise</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Calendrier de la valise</h1>
      <Separator className="mb-6" />

      <SuitcaseCalendar 
        items={items}
        onDateSelect={onDateSelect}
        selectedDate={selectedDate}
      />

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Planifier votre valise</CardTitle>
            <CardDescription>
              Utilisez le calendrier pour planifier les tenues à porter chaque jour de votre voyage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Sélectionnez une date dans le calendrier pour voir les vêtements planifiés</li>
              <li>Ajoutez des vêtements à votre valise depuis la page principale</li>
              <li>Organisez vos tenues par jour pour faciliter votre voyage</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuitcaseCalendarPage;
