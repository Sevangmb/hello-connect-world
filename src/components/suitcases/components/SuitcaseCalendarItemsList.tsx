
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SuitcaseItem } from '../types';

interface SuitcaseCalendarItemsListProps {
  selectedDate: Date;
  items: SuitcaseItem[];
}

export const SuitcaseCalendarItemsList: React.FC<SuitcaseCalendarItemsListProps> = ({
  selectedDate,
  items
}) => {
  const formattedDate = format(selectedDate, 'PPP', { locale: fr });

  if (!items.length) {
    return (
      <div className="p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-2">Items pour {formattedDate}</h3>
        <p className="text-muted-foreground">Aucun vêtement planifié pour cette date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Items pour {formattedDate}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="p-3 bg-accent rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.clothes?.image_url && (
                <img 
                  src={item.clothes.image_url} 
                  alt={item.clothes.name} 
                  className="w-10 h-10 rounded-md object-cover"
                />
              )}
              <span>{item.clothes?.name}</span>
            </div>
            <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
              {item.quantity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
