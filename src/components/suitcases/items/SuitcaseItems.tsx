
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SuitcaseItem } from '../types';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SuitcaseItemsEmpty } from './SuitcaseItemsEmpty';
import { SuitcaseItemsHeader } from './SuitcaseItemsHeader';
import { Checkbox } from '@/components/ui/checkbox';

interface SuitcaseItemsProps {
  suitcaseId: string;
  onAddItems: () => void;
}

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ 
  suitcaseId, 
  onAddItems 
}) => {
  const { items, isLoading, error, updateItem } = useSuitcaseItems(suitcaseId);

  const handleToggleItem = async (item: SuitcaseItem) => {
    await updateItem.mutateAsync({
      id: item.id,
      is_packed: !item.is_packed
    });
  };

  const handleAddNotes = async (item: SuitcaseItem, notes: string) => {
    await updateItem.mutateAsync({
      id: item.id,
      notes
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Une erreur est survenue: {error.message}
      </div>
    );
  }

  if (items.length === 0) {
    return <SuitcaseItemsEmpty onAddItems={onAddItems} />;
  }

  return (
    <div className="space-y-4">
      <SuitcaseItemsHeader onAddItems={onAddItems} />
      
      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  <Checkbox 
                    checked={item.is_packed || false}
                    onCheckedChange={() => handleToggleItem(item)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-medium ${item.is_packed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.clothes?.name || 'Vêtement sans nom'}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      Qté: {item.quantity}
                    </span>
                  </div>
                  
                  {item.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.notes}
                    </p>
                  )}
                  
                  {item.clothes?.category && (
                    <div className="mt-1">
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                        {item.clothes.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <Button variant="outline" onClick={onAddItems}>
          Ajouter d'autres vêtements
        </Button>
      </div>
    </div>
  );
};
