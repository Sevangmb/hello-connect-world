
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SuitcaseItemsHeaderProps } from '../types';

export const SuitcaseItemsHeader: React.FC<SuitcaseItemsHeaderProps> = ({
  itemCount,
  onAddItems
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-semibold">Articles de la valise</h2>
        <p className="text-sm text-muted-foreground">
          {itemCount} article{itemCount !== 1 ? 's' : ''} dans votre valise
        </p>
      </div>
      <Button onClick={onAddItems}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter
      </Button>
    </div>
  );
};
