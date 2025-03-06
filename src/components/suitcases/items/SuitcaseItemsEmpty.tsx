
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SuitcaseItemsEmptyProps {
  suitcaseId: string;
}

export const SuitcaseItemsEmpty: React.FC<SuitcaseItemsEmptyProps> = ({ suitcaseId }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="bg-primary-foreground p-6 rounded-full mb-4">
        <svg
          className="h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 8v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8M4 4h16v4H4V4zm4 9h8"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Aucun vêtement dans cette valise</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Ajoutez des vêtements à votre valise pour commencer à organiser votre voyage.
      </p>
      <Button onClick={() => {}}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un vêtement
      </Button>
    </div>
  );
};
