
import React from 'react';
import { useShopItems } from './hooks/useShopItems';

const ShopItems = () => {
  const { data: items, isLoading, error } = useShopItems();
  
  if (isLoading) return <div>Loading items...</div>;
  if (error) return <div>Error loading items: {error.message}</div>;
  
  return (
    <div>
      <h2>Shop Items</h2>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="border p-4 rounded-md">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="font-bold">${item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No items found</p>
      )}
    </div>
  );
};

export default ShopItems;
