
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SuitcaseItem } from '../types';
import { ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SuitcaseCalendarItemsListProps {
  selectedDate: Date;
  items: SuitcaseItem[];
  loading?: boolean;
}

export const SuitcaseCalendarItemsList: React.FC<SuitcaseCalendarItemsListProps> = ({
  selectedDate,
  items,
  loading = false
}) => {
  const formattedDate = format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize text-lg">
          {formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center p-4">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-6 px-4">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
            <p className="text-muted-foreground">
              Aucun vêtement prévu pour cette journée.
              <br />
              Ajoutez des vêtements pour planifier votre tenue.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center border-b pb-2">
                <div className="h-10 w-10 bg-muted rounded-md mr-3 flex-shrink-0 overflow-hidden">
                  {item.clothes?.image_url ? (
                    <img 
                      src={item.clothes.image_url} 
                      alt={item.clothes.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{item.clothes?.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {item.clothes?.category}
                    </Badge>
                    {item.clothes?.color && (
                      <span className="text-xs text-muted-foreground">{item.clothes.color}</span>
                    )}
                  </div>
                </div>
                <div className="text-sm">
                  x{item.quantity}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
