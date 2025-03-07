
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SuitcaseItemsHeaderProps } from '../types';

export const SuitcaseItemsHeader: React.FC<SuitcaseItemsHeaderProps> = ({ onAddItems }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-medium text-lg">Vêtements dans cette valise</h3>
      <Button size="sm" variant="outline" onClick={onAddItems}>
        <Plus className="h-3.5 w-3.5 mr-1" />
        Ajouter
      </Button>
    </div>
  );
};
