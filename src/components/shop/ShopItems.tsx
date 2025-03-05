import React, { useState, useEffect } from 'react';
import { ShopItem } from '@/core/shop/domain/types';
import { useShop } from '@/hooks/useShop';
import ShopItemCard from "./components/ShopItemCard";
import ShopItemsFilter from './components/ShopItemsFilter';

const ShopItems = ({ shopId }: { shopId: string }) => {
  const { shop, isShopLoading, getShopItems } = useShop();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      if (shopId) {
        const shopItems = await getShopItems(shopId);
        setItems(shopItems || []);
      }
      setIsLoading(false);
    };

    loadItems();
  }, [shopId, getShopItems]);

  useEffect(() => {
    if (!items) return;

    let filteredItems = [...items];

    if (filterValue) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (sortValue) {
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
    }

    setItems(filteredItems);
  }, [filterValue, sortValue, items]);

  if (isLoading || isShopLoading) {
    return <div>Loading items...</div>;
  }

  if (!items) {
    return <div>No items found for this shop.</div>;
  }

  const ShopItemsFilter = ({ 
    filterValue, 
    onFilterChange, 
    sortValue, 
    onSortChange 
  }: {
    filterValue: string;
    onFilterChange: (value: string) => void;
    sortValue: string;
    onSortChange: (value: string) => void;
  }) => {
    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search items..."
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>
      </div>
    );
  };

  const onFilterChange = (value: string) => {
    setFilterValue(value);
  };

  const onSortChange = (value: string) => {
    setSortValue(value);
  };

  // Fixed the ShopItemsFilter props
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>
      <ShopItemsFilter 
        filterValue={filterValue} 
        onFilterChange={setFilterValue}
        sortValue={sortValue} 
        onSortChange={setSortValue}
      />
    </div>
  );
};

export default ShopItems;
