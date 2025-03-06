
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';
import { LoadingState } from '@/components/ui/loading-state';
import { useTransitionState } from '@/hooks/useTransitionState';
import { Plus } from 'lucide-react';
import { SuitcaseItemsEmpty } from './SuitcaseItemsEmpty';
import { Suitcase } from '../types';

interface SuitcaseItemsProps {
  suitcase: Suitcase;
}

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ suitcase }) => {
  const { items, isLoading, error, addItem, removeItem, updateItem } = useSuitcaseItems(suitcase.id);
  const isTransitioning = useTransitionState(isLoading);

  if (error) {
    return <div className="text-red-500 p-4">Erreur de chargement des éléments de la valise.</div>;
  }

  if (isTransitioning) {
    return <LoadingState count={4} />;
  }

  if (items.length === 0) {
    return <SuitcaseItemsEmpty suitcaseId={suitcase.id} />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Éléments de la valise ({items.length})</h3>
        <Button size="sm" onClick={() => {}}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{item.clothes?.name || 'Vêtement'}</h4>
                <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                {item.notes && <p className="text-sm mt-1">{item.notes}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateItem.mutate({ id: item.id, is_packed: !item.is_packed })}
                >
                  {item.is_packed ? 'Décocher' : 'Cocher'}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeItem.mutate(item.id)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
