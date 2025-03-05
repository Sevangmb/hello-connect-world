
import React from 'react';
import { useShopItems } from './hooks/useShopItems';
import { ShopItemsFilter } from './components/ShopItemsFilter';
import { ShopItemCard } from './components/ShopItemCard';
import { ShopItem } from '@/core/shop/domain/types';

export const ShopItems: React.FC = () => {
  const { data: items, isLoading, error, filter, setFilter } = useShopItems();

  if (isLoading) {
    return <div>Loading items...</div>;
  }

  if (error) {
    return <div>Error loading items: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shop Items</h1>
      
      <ShopItemsFilter filter={filter} setFilter={setFilter} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {items?.map((item: ShopItem) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>
      
      {(!items || items.length === 0) && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No items found</p>
        </div>
      )}
    </div>
  );
};

export default ShopItems;
