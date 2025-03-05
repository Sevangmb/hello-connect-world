
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useShopItems, UseShopItemsProps } from './hooks/useShopItems';
import { ShopItemCard } from './components/ShopItemCard';
import { ShopItemsFilter } from './components/ShopItemsFilter';
import { Skeleton } from '@/components/ui/skeleton';

interface ShopItemsProps {
  shopId?: string;
  title?: string;
  showFilters?: boolean;
  limit?: number;
}

export const ShopItems: React.FC<ShopItemsProps> = ({
  shopId,
  title = "Produits",
  showFilters = true,
  limit
}) => {
  const [filters, setFilters] = useState({});
  
  const shopItemsProps: UseShopItemsProps = {
    shopId,
    limit,
    filters
  };
  
  const { items, isLoading, error } = useShopItems(shopItemsProps);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {showFilters && (
            <div className="md:col-span-1">
              <ShopItemsFilter onFilterChange={handleFilterChange} />
            </div>
          )}
          
          <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-2/3 mb-2" />
                      <Skeleton className="h-4 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-9 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">
                Une erreur s'est produite lors du chargement des produits
              </div>
            ) : items.length === 0 ? (
              <div className="text-center text-gray-500 p-8">
                Aucun produit disponible
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <ShopItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopItems;
