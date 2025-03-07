
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SuitcaseItemsEmptyProps } from '../types';

export const SuitcaseItemsEmpty: React.FC<SuitcaseItemsEmptyProps> = ({ onAddItems }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
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
            d="M20.91 8.84L8.56 21.19a.999.999 0 01-1.41 0l-4.7-4.7a.999.999 0 010-1.41l12.02-12.02c.39-.39 1.02-.39 1.41 0l5.02 5.02c.39.39.4 1.03.01 1.42z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Aucun vêtement dans cette valise</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Ajoutez des vêtements à votre valise pour commencer à organiser votre voyage.
      </p>
      <Button onClick={onAddItems}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter des vêtements
      </Button>
    </div>
  );
};
