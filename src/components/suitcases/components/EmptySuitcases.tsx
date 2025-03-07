
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptySuitcasesProps } from '../types';

export const EmptySuitcases: React.FC<EmptySuitcasesProps> = ({ onCreateClick }) => {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-center">Aucune valise trouvée</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-gray-500">
        <p>Vous n'avez pas encore créé de valise. Créez votre première valise pour commencer à organiser vos voyages.</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Créer une valise
        </Button>
      </CardFooter>
    </Card>
  );
};
