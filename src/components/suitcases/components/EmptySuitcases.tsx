
import React from 'react';
import { Button } from '@/components/ui/button';

export interface EmptySuitcasesProps {
  onCreateClick: () => void;
}

export function EmptySuitcases({ onCreateClick }: EmptySuitcasesProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 text-center">
      <div className="text-4xl mb-2">🧳</div>
      <h2 className="text-2xl font-semibold">Vous n'avez pas encore de valise</h2>
      <p className="text-muted-foreground max-w-md">
        Créez votre première valise pour commencer à organiser vos voyages.
      </p>
      <Button 
        onClick={onCreateClick}
        className="mt-4"
      >
        Créer ma première valise
      </Button>
    </div>
  );
}
