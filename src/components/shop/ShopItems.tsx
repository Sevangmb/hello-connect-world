
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ShopItem } from '@/core/shop/domain/types';
import { ShoppingBag } from 'lucide-react';
import ShopItemCard from './components/ShopItemCard';
import ShopItemsFilter from './components/ShopItemsFilter';

interface ShopItemsProps {
  shopId: string;
}

const ShopItems: React.FC<ShopItemsProps> = ({ shopId }) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const { toast } = useToast();

  // Load shop items
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        // This would be implemented in a real hook
        // const data = await getShopItems(shopId);
        const data: ShopItem[] = []; // Placeholder for real data
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error loading shop items:', error);
        toast({
          variant: "destructive",
          title: "Error loading items",
          description: "There was a problem loading the shop items."
        });
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [shopId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter and sort items
  useEffect(() => {
    let result = [...items];
    
    // Apply text filter
    if (filter) {
      const lowercaseFilter = filter.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(lowercaseFilter) || 
        (item.description && item.description.toLowerCase().includes(lowercaseFilter))
      );
    }
    
    // Apply sorting
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    
    setFilteredItems(result);
  }, [items, filter, sort]);

  if (loading) {
    return (
      <div>
        <ShopItemsFilter 
          filter={filter} 
          setFilter={setFilter} 
          sort={sort} 
          setSort={setSort}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full rounded-t-md" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shop Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-900">No items found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              This shop currently doesn't have any items for sale. Please check back later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div>
        <ShopItemsFilter 
          filter={filter} 
          setFilter={setFilter} 
          sort={sort} 
          setSort={setSort} 
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-900">No matching items</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              No items match your current filter. Try changing your search criteria.
            </p>
          </CardContent>
        </Card>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ShopItems;
