
import React, { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { ShopItemCard } from './components/ShopItemCard';
import { ShopItemsFilter } from './components/ShopItemsFilter';
import { Loader2 } from 'lucide-react';
import { ShopItem } from '@/core/shop/domain/types';

interface ShopItemsProps {
  shopId: string;
}

export const ShopItems: React.FC<ShopItemsProps> = ({ shopId }) => {
  const { getShopItems } = useShop();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    async function fetchShopItems() {
      setLoading(true);
      try {
        const shopItems = await getShopItems(shopId);
        setItems(shopItems);
      } catch (error) {
        console.error('Error fetching shop items:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchShopItems();
  }, [shopId, getShopItems]);

  // Filter and sort items
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sort === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sort === 'price-low') {
      return a.price - b.price;
    } else if (sort === 'price-high') {
      return b.price - a.price;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center">
        <h3 className="text-lg font-medium">Aucun article</h3>
        <p className="text-muted-foreground">Cette boutique n'a pas encore d'articles à vendre.</p>
      </div>
    );
  }

  return (
    <div>
      <ShopItemsFilter 
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />
      
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedItems.map(item => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
