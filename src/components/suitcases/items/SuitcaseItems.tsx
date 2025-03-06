
import React from 'react';
import { Button } from '@/components/ui/button';

export interface SuitcaseItemsProps {
  suitcaseId: string;
  onBack: () => void;
}

export function SuitcaseItems({ suitcaseId, onBack }: SuitcaseItemsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <h2 className="text-xl font-semibold">Éléments de la valise</h2>
        <Button>Ajouter</Button>
      </div>
      
      <div className="border rounded-md p-8 text-center">
        <p>Aucun élément dans cette valise.</p>
        <Button variant="outline" className="mt-4">
          Ajouter des vêtements
        </Button>
      </div>
    </div>
  );
}
