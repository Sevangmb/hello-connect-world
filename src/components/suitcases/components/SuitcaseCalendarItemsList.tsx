
import React from 'react';
import { SuitcaseItem } from '@/components/suitcases/utils/types';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';
import { Loader2 } from 'lucide-react';

export interface SuitcaseCalendarItemsListProps {
  suitcaseId: string;
  date: string;
  onItemsChanged?: () => void;
}

export const SuitcaseCalendarItemsList: React.FC<SuitcaseCalendarItemsListProps> = ({
  suitcaseId,
  date,
  onItemsChanged
}) => {
  const { data, isLoading } = useSuitcaseItems(suitcaseId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        Aucun vêtement pour cette date
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {data.map((item) => (
        <div key={item.id} className="flex items-center p-2 bg-card rounded border">
          {item.clothes?.image_url && (
            <img 
              src={item.clothes.image_url} 
              alt={item.clothes?.name} 
              className="w-10 h-10 rounded-md mr-3 object-cover"
            />
          )}
          <div>
            <p className="font-medium">{item.clothes?.name || 'Vêtement inconnu'}</p>
            <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
