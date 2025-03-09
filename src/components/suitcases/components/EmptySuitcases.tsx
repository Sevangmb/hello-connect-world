
import React from 'react';
import { Luggage, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptySuitcasesProps } from '../types';

export const EmptySuitcases: React.FC<EmptySuitcasesProps> = ({ onCreateNew }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg text-center">
      <Luggage className="h-12 w-12 text-muted-foreground/60 mb-4" />
      <h3 className="text-lg font-medium mb-2">Aucune valise</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Vous n'avez pas encore créé de valise. Créez-en une pour préparer votre prochain voyage !
      </p>
      <Button onClick={onCreateNew}>
        <Plus className="h-4 w-4 mr-2" />
        Créer une valise
      </Button>
    </div>
  );
};
