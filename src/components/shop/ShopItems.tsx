
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useShopItems } from './hooks/useShopItems';
import ShopItemCard from './components/ShopItemCard';
import { ShopItemsFilter, ShopItemsFilterProps } from './components/ShopItemsFilter';

export const ShopItems = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [filterValue, setFilterValue] = useState('all');
  const [sortValue, setSortValue] = useState('newest');
  const { items, isLoading, error } = useShopItems(shopId);

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>
          Une erreur est survenue lors du chargement des articles: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 my-4">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // Filter and sort items
  const filteredItems = items?.filter(item => {
    if (filterValue === 'all') return true;
    return item.category === filterValue;
  }) || [];

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortValue === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortValue === 'price-low') {
      return a.price - b.price;
    }
    if (sortValue === 'price-high') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="my-4 space-y-4">
      <ShopItemsFilter
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      {sortedItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun article disponible.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map(item => (
            <ShopItemCard key={item.id} item={item} shopId={shopId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopItems;
