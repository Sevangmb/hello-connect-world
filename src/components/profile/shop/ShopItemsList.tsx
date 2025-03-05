
import React from 'react';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShopItem } from '@/core/shop/domain/types';
import { Badge } from '@/components/ui/badge';

export const ShopItemsList: React.FC = () => {
  const { useShopItems } = useShop();
  const { data: items, isLoading, error } = useShopItems();

  if (isLoading) {
    return <div>Loading shop items...</div>;
  }

  if (error) {
    return <div>Error loading shop items: {error.message}</div>;
  }

  if (!items || items.length === 0) {
    return <div>No items in your shop yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Shop Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: ShopItem) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="h-48 w-full object-cover rounded-md mb-4" 
                />
              )}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.description || "No description available"}
              </p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="px-2 py-1">
                  {item.price}€
                </Badge>
                <Badge variant={item.status === 'available' ? 'success' : 'secondary'} className="px-2 py-1">
                  {item.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
