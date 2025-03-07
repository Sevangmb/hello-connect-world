
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EmptySuitcasesProps } from '../types';

export const EmptySuitcases: React.FC<EmptySuitcasesProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg">
      <div className="w-16 h-16 mb-4 text-muted-foreground">
        {/* On pourrait ajouter une icône de valise ici */}
      </div>
      <h3 className="text-lg font-medium mb-2">Aucune valise trouvée</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Vous n'avez pas encore créé de valise. Commencez par en créer une pour organiser vos vêtements de voyage.
      </p>
      <Button onClick={onCreateClick}>
        <Plus className="h-4 w-4 mr-2" />
        Créer une valise
      </Button>
    </div>
  );
};
