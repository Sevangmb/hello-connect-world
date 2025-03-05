
import React from 'react';
import { useShop } from '@/hooks/useShop';
import { ShopItem } from '@/core/shop/domain/types';

export interface ShopItemsListProps {
  shopId: string;
}

export default function ShopItemsList({ shopId }: ShopItemsListProps) {
  const [items, setItems] = React.useState<ShopItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Mock implementation for the shop hooks
  const getShopItems = async (shopId: string) => {
    // Mock implementation
    return [] as ShopItem[];
  };
  
  const updateShopItemStatus = async (itemId: string, status: string) => {
    // Mock implementation
    return true;
  };
  
  const removeShopItem = async (itemId: string) => {
    // Mock implementation
    return true;
  };

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getShopItems(shopId);
        setItems(data);
      } catch (err) {
        setError('Failed to load shop items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [shopId]);

  const handleStatusChange = async (itemId: string, status: string) => {
    try {
      await updateShopItemStatus(itemId, status);
      // Refresh items after status change
      const data = await getShopItems(shopId);
      setItems(data);
    } catch (err) {
      setError('Failed to update item status');
      console.error(err);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeShopItem(itemId);
      // Refresh items after removal
      const data = await getShopItems(shopId);
      setItems(data);
    } catch (err) {
      setError('Failed to remove item');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading shop items...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (items.length === 0) {
    return <div>No items found in this shop.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Shop Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-md p-4">
            <div className="aspect-w-16 aspect-h-9 mb-2">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="object-cover h-48 w-full"
                />
              ) : (
                <div className="bg-gray-100 flex items-center justify-center h-48">
                  No image
                </div>
              )}
            </div>
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-gray-500">{item.description}</p>
            <div className="flex justify-between mt-2">
              <span className="font-semibold">${item.price.toFixed(2)}</span>
              <span
                className={
                  item.stock > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
              </span>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() =>
                  handleStatusChange(
                    item.id,
                    item.status === "available" ? "sold_out" : "available"
                  )
                }
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                {item.status === "available" ? "Mark as Sold Out" : "Mark as Available"}
              </button>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Fix for correct imports in parent files
export { default as ShopItemsList } from './ShopItemsList';
