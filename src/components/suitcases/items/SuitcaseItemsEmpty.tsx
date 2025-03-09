
import React from 'react';
import { Luggage, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SuitcaseItemsEmptyProps } from '../types';

export const SuitcaseItemsEmpty: React.FC<SuitcaseItemsEmptyProps> = ({ onAddItems }) => {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg my-6">
      <Luggage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Valise vide</h3>
      <p className="text-gray-500 mb-4">
        Vous n'avez pas encore ajouté d'articles à cette valise.
      </p>
      <Button onClick={onAddItems}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter des articles
      </Button>
    </div>
  );
};
