
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShop } from '@/hooks/useShop';
import { ShopItemCard } from './components/ShopItemCard';
import ShopItemsFilter from './components/ShopItemsFilter';

interface ShopItemsProps {
  shopId: string;
}

export default function ShopItems({ shopId }: ShopItemsProps) {
  const { getShopItems, isLoadingShopItems } = useShop();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      if (shopId) {
        try {
          const shopItems = await getShopItems(shopId);
          setItems(shopItems || []);
        } catch (error) {
          console.error('Error loading shop items:', error);
        }
      }
    };

    loadItems();
  }, [shopId, getShopItems]);

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      if (filter === 'all') return true;
      if (filter === 'available') return item.status === 'available';
      if (filter === 'sold_out') return item.status === 'sold_out';
      return true;
    })
    .filter(item => {
      if (!search) return true;
      return item.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === 'price_low') return a.price - b.price;
      if (sort === 'price_high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <ShopItemsFilter 
          filterValue={filter} 
          setFilterValue={setFilter} 
          sortValue={sort} 
          setSortValue={setSort} 
        />
      </div>

      {isLoadingShopItems ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-40 bg-slate-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={{
                ...item,
                image: item.image_url || '/placeholder.svg',
                seller_id: item.shop?.user_id || ''
              }}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-lg text-gray-500">No items found</p>
            <p className="text-sm text-gray-400">Try changing your filters or search terms</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { ShopItems };
