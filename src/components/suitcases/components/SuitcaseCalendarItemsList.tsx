
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';
import { useSuitcaseCalendarItems } from '@/hooks/useSuitcaseCalendarItems';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SuitcaseCalendarItemsListProps {
  suitcaseId: string;
  date: string;
}

export const SuitcaseCalendarItemsList: React.FC<SuitcaseCalendarItemsListProps> = ({ 
  suitcaseId, 
  date 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const calendarItems = useSuitcaseCalendarItems(suitcaseId);
  const { items: suitcaseItems, isLoading: itemsLoading } = useSuitcaseItems(suitcaseId);
  
  // Filter calendar items for the selected date
  const dateItems = calendarItems.data?.filter(item => {
    return item.date === date;
  }) || [];

  // Get clothesItems based on the IDs in dateItems
  const clothesForDate = dateItems.length > 0 
    ? suitcaseItems.filter(item => dateItems[0].items.includes(item.clothes_id)) 
    : [];

  if (calendarItems.isLoading || itemsLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (calendarItems.error) {
    return <div>Erreur: {calendarItems.error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          {clothesForDate.length > 0 
            ? `${clothesForDate.length} articles prévus pour cette date` 
            : "Aucun article prévu pour cette date"}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter des articles
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter des articles pour {new Date(date).toLocaleDateString()}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {suitcaseItems.length > 0 ? (
                <div className="space-y-2">
                  {suitcaseItems.map(item => (
                    <Card key={item.id} className="p-0 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center p-3">
                          {item.clothes?.image_url && (
                            <img 
                              src={item.clothes.image_url} 
                              alt={item.clothes?.name || 'Vêtement'} 
                              className="h-12 w-12 rounded-md object-cover mr-3" 
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{item.clothes?.name || 'Vêtement'}</div>
                            <div className="text-sm text-gray-500">{item.clothes?.category}</div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              const existingDateItem = dateItems[0];
                              
                              if (existingDateItem) {
                                // Add the item to existing date items
                                if (!existingDateItem.items.includes(item.clothes_id)) {
                                  calendarItems.updateCalendarItem.mutate({
                                    id: existingDateItem.id,
                                    items: [...existingDateItem.items, item.clothes_id]
                                  });
                                }
                              } else {
                                // Create new date item
                                calendarItems.addCalendarItem.mutate({
                                  suitcase_id: suitcaseId,
                                  date,
                                  items: [item.clothes_id]
                                });
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center text-gray-500">
                  Aucun article disponible dans cette valise
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {clothesForDate.length > 0 ? (
        <div className="space-y-2">
          {clothesForDate.map(item => (
            <Card key={item.id} className="p-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-3">
                  {item.clothes?.image_url && (
                    <img 
                      src={item.clothes.image_url} 
                      alt={item.clothes?.name || 'Vêtement'} 
                      className="h-12 w-12 rounded-md object-cover mr-3" 
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.clothes?.name || 'Vêtement'}</div>
                    <div className="text-sm text-gray-500">{item.clothes?.category}</div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      const existingDateItem = dateItems[0];
                      if (existingDateItem) {
                        const updatedItems = existingDateItem.items.filter(id => id !== item.clothes_id);
                        
                        if (updatedItems.length === 0) {
                          // No items left, remove the entire calendar item
                          calendarItems.removeCalendarItem.mutate(existingDateItem.id);
                        } else {
                          // Update with remaining items
                          calendarItems.updateCalendarItem.mutate({
                            id: existingDateItem.id,
                            items: updatedItems
                          });
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          Aucun article planifié pour cette journée
        </div>
      )}
    </div>
  );
};
