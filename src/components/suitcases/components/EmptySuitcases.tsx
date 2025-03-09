
import React from 'react';
import { Luggage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptySuitcasesProps } from '../types';

export const EmptySuitcases: React.FC<EmptySuitcasesProps> = ({ onCreateNew }) => {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      <Luggage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Aucune valise trouvée</h3>
      <p className="text-gray-500 mb-4">
        Vous n'avez pas encore créé de valise. Créez votre première valise pour
        commencer à organiser vos voyages.
      </p>
      <Button onClick={onCreateNew}>
        Créer une valise
      </Button>
    </div>
  );
};
