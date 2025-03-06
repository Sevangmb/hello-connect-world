
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Loader, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface SuitcaseItem {
  id: string;
  suitcase_id: string;
  clothes_id: string;
  quantity: number;
  created_at: string;
  name?: string;
  clothes?: {
    name: string;
    image_url?: string;
    category?: string;
  };
}

const useSuitcaseItems = (suitcaseId: string) => {
  return useQuery({
    queryKey: ['suitcase-items', suitcaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suitcase_items')
        .select('*, clothes(name, image_url, category)')
        .eq('suitcase_id', suitcaseId);
      
      if (error) throw error;
      return data as SuitcaseItem[];
    },
    enabled: !!suitcaseId
  });
};

interface SuitcaseItemsProps {
  suitcaseId: string;
}

export const SuitcaseItems: React.FC<SuitcaseItemsProps> = ({ suitcaseId }) => {
  const { data: items, isLoading, error, refetch } = useSuitcaseItems(suitcaseId);

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('suitcase_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Refetch items after deletion
      refetch();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Une erreur est survenue lors du chargement des articles
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-muted/40 rounded-lg p-8 text-center">
        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Cette valise est vide</h3>
        <p className="text-muted-foreground mb-4">
          Ajoutez des vêtements à votre valise pour commencer à l'organiser.
        </p>
        <Button>Ajouter des vêtements</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              <span>{item.clothes?.name || 'Article sans nom'}</span>
              <span className="text-sm font-normal">Quantité: {item.quantity}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {item.clothes?.image_url ? (
                <img 
                  src={item.clothes.image_url} 
                  alt={item.clothes.name} 
                  className="h-12 w-12 object-cover rounded-md"
                />
              ) : (
                <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              {item.clothes?.category && (
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {item.clothes.category}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => handleRemoveItem(item.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
