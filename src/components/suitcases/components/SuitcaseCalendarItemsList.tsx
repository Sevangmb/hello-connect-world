
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SuitcaseCalendarItem, SuitcaseItem } from '../types';

interface SuitcaseCalendarItemsListProps {
  calendarItems: SuitcaseCalendarItem[];
  isLoading?: boolean;
  error?: string | null;
}

export const SuitcaseCalendarItemsList: React.FC<SuitcaseCalendarItemsListProps> = ({
  calendarItems,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 space-y-2">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
        <p className="text-destructive font-medium">Une erreur est survenue</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  if (!calendarItems || calendarItems.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Aucun élément à afficher</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {calendarItems.map((day) => (
        <Card key={day.id} className="overflow-hidden">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-md font-medium">
              {format(parseISO(day.date), 'EEEE d MMMM', { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {day.items.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">
                  Aucun vêtement planifié pour ce jour
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {day.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center p-2 rounded-md border bg-background"
                  >
                    <div className="w-10 h-10 bg-muted mr-3 flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden">
                      {item.clothes?.image_url ? (
                        <img 
                          src={item.clothes.image_url} 
                          alt={item.clothes?.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <ShoppingBag className="h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.clothes?.name || 'Vêtement'}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Badge variant="outline" className="mr-2 px-1">
                          {item.clothes?.category || 'Divers'}
                        </Badge>
                        {item.quantity > 1 && (
                          <span>Qté: {item.quantity}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
