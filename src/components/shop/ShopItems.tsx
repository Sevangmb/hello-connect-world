
import React, { useState } from "react";
import { useShopItems } from "@/hooks/shop/hooks/useShopItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ShopItemCard from "./components/ShopItemCard";
import ShopItemsFilter from "./components/ShopItemsFilter";

interface ShopItemsProps {
  shopId: string;
}

export const ShopItems: React.FC<ShopItemsProps> = ({ shopId }) => {
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("newest");
  const { data: shopItems, isLoading, error } = useShopItems({ shopId });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square w-full">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-center text-muted-foreground">
            Une erreur est survenue lors du chargement des articles.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!shopItems || shopItems.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-center text-muted-foreground">
            Cette boutique n'a pas encore d'articles à vendre.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Filter and sort items
  const filteredItems = shopItems
    .filter((item) => {
      if (!filterValue) return true;
      return (
        item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(filterValue.toLowerCase()))
      );
    })
    .sort((a, b) => {
      switch (sortValue) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default: // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ShopItemsFilter 
          filterValue={filterValue} 
          onFilterChange={setFilterValue} 
          sortValue={sortValue} 
          onSortChange={setSortValue}
        />
        <p className="text-sm text-muted-foreground">
          {filteredItems.length} article{filteredItems.length !== 1 && "s"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ShopItems;
