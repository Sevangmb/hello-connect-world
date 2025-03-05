// Au début du fichier, ajoutons l'interface des props
export interface ShopItemsListProps {
  shopId: string;
}

import { useEffect } from 'react';
import { useShopItems } from '@/components/shop/hooks/useShopItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area"

export const ShopItemsList = ({ shopId }: ShopItemsListProps) => {
  const { data: shopItems, isLoading, isError, error, refetch } = useShopItems({ shopId });

  useEffect(() => {
    refetch();
  }, [shopId, refetch]);

  if (isLoading) {
    return <div className="flex justify-center p-6">Chargement des articles...</div>;
  }

  if (isError) {
    return <div className="flex justify-center p-6 text-red-500">Erreur: {error?.message || 'Failed to load items'}</div>;
  }

  if (!shopItems || shopItems.length === 0) {
    return <div className="flex justify-center p-6">Aucun article disponible pour le moment.</div>;
  }

  return (
    <ScrollArea className="h-[500px] w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {shopItems.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>Prix: {item.price} €</p>
                <p>Stock: {item.stock}</p>
                <Badge>{item.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ShopItemsList;
