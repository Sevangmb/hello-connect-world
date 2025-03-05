
import React from 'react';
import { useShopItems } from './hooks/useShopItems';
import { ShopItemsFilter } from './components/ShopItemsFilter';
import { ShopItemCard } from './components/ShopItemCard';
import { ShopItem } from '@/core/shop/domain/types';
import { Skeleton } from '@/components/ui/skeleton';

export function ShopItems() {
  const { data, isLoading, error, filter, setFilter } = useShopItems();

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h3 className="text-lg font-medium">Error loading items</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shop Items</h1>
      
      <ShopItemsFilter filter={filter} setFilter={setFilter} />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-md overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((item: ShopItem) => (
            <ShopItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
      
      {data && data.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No items found</p>
        </div>
      )}
    </div>
  );
}
