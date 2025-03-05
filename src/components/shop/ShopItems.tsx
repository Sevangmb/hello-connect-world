
import { useState } from 'react';
import { useShopItems } from './hooks/useShopItems';
import { ShopItemsFilter, FilterOptions } from './components/ShopItemsFilter';
import { ShopItemCard } from './components/ShopItemCard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const ShopItems = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterOptions>({
    sort: 'price-asc',
    minPrice: undefined,
    maxPrice: undefined,
    category: undefined
  });
  
  const { data: shopItems, isLoading, error } = useShopItems(filters);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Une erreur est survenue lors du chargement des articles.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!shopItems || shopItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Aucun article n'est disponible pour le moment.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Boutique</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <ShopItemsFilter onFilterChange={handleFilterChange} />
        </div>
        
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => (
              <ShopItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
