import React, { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { ShopItem } from '@/core/shop/domain/types';
import ShopItemCard from '@/components/shop/components/ShopItemCard';
import ShopItemsFilter from '@/components/shop/components/ShopItemsFilter';

const ShopItemsList = ({ shopId }: { shopId: string }) => {
  const { shop, isShopLoading, getShopItems } = useShop();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('newest');

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const shopItems = await getShopItems(shopId);
        setItems(shopItems);
      } catch (error) {
        console.error("Failed to fetch shop items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [shopId, getShopItems]);

  useEffect(() => {
    if (!items) return;

    let filteredItems = [...items];

    // Apply filtering
    if (filterValue) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortValue) {
      case 'price-asc':
        filteredItems.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredItems.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filteredItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'name-asc':
        filteredItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setItems(filteredItems);
  }, [filterValue, sortValue, items]);

  if (isLoading) {
    return <div>Loading items...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <ShopItemsFilter 
        filterValue={filterValue} 
        onFilterChange={setFilterValue}
        sortValue={sortValue} 
        onSortChange={setSortValue}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items && items.map(item => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ShopItemsList;
