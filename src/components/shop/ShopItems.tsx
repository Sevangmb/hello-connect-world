
import React, { useState } from 'react';
import { useShopItems } from './hooks/useShopItems';
import { ShopItemsFilter } from './components/ShopItemsFilter';
import { useAuth } from '@/hooks/useAuth';
import { ShopItem } from '@/core/shop/domain/types';
import { ShopItemCard } from './components/ShopItemCard';

interface ShopItemsProps {
  shopId?: string;
  showFilters?: boolean;
  title?: string;
}

export const ShopItems: React.FC<ShopItemsProps> = ({ shopId, showFilters = true, title = 'Articles' }) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    sort: 'created_at:desc',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    category: undefined as string | undefined,
  });
  
  const { data, isLoading, error } = useShopItems({
    shopId,
    sortBy: filters.sort,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    category: filters.category,
    userId: user?.id
  });
  
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  if (isLoading) {
    return <div className="p-4">Chargement des articles...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-500">Erreur: {error.message}</div>;
  }
  
  if (!data || data.length === 0) {
    return <div className="p-4">Aucun article disponible.</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showFilters && (
          <ShopItemsFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((item: ShopItem) => (
          <ShopItemCard 
            key={item.id} 
            item={item}
            userId={user?.id || ''}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopItems;
