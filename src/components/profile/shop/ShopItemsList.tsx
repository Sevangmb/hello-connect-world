
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { ShopItem, ShopItemStatus } from '@/core/shop/domain/types';

interface ShopItemsListProps {
  shopId: string;
}

export const ShopItemsList: React.FC<ShopItemsListProps> = ({ shopId }) => {
  const { data: items, isLoading, error, refetch } = useQuery({
    queryKey: ['shopItems', shopId],
    queryFn: async () => {
      const shopService = getShopService();
      return shopService.getShopItems(shopId);
    }
  });

  const handleDeleteItem = async (itemId: string) => {
    try {
      const shopService = getShopService();
      await shopService.deleteShopItem(itemId);
      refetch();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleUpdateStatus = async (itemId: string, status: ShopItemStatus) => {
    try {
      const shopService = getShopService();
      await shopService.updateShopItem(itemId, { status });
      refetch();
    } catch (err) {
      console.error('Error updating item status:', err);
    }
  };

  if (isLoading) {
    return <div>Chargement des articles...</div>;
  }

  if (error) {
    return <div>Erreur: {(error as Error).message}</div>;
  }

  if (!items || items.length === 0) {
    return <div>Aucun article trouvé dans votre boutique.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Vos articles ({items.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              <p className="font-bold mt-2">{item.price}€</p>
              <p className="text-sm">Stock: {item.stock}</p>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.status === 'available' ? 'Disponible' : 'Épuisé'}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleUpdateStatus(
                    item.id,
                    item.status === 'available' ? 'sold_out' : 'available'
                  )
                }
              >
                {item.status === 'available' ? 'Marquer comme épuisé' : 'Disponible'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteItem(item.id)}
              >
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShopItemsList;
