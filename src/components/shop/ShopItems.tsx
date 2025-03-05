
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useShop } from "@/hooks/useShop";
import { ShopItem } from "@/core/shop/domain/types";
import { ShopItemCard } from "@/components/shop/components/ShopItemCard";
import ShopItemsFilter, { ShopItemsFilterProps } from "@/components/shop/components/ShopItemsFilter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export interface ShopItemsProps {
  shopId: string;
}

export default function ShopItems({ shopId }: ShopItemsProps) {
  const { shop, isShopLoading, getShopItems } = useShop();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchItems = async () => {
      if (!shopId) return;
      
      try {
        setLoading(true);
        const shopItems = await getShopItems(shopId);
        setItems(shopItems);
      } catch (error) {
        console.error("Error fetching shop items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [shopId, getShopItems]);

  // Filter items based on selected filter
  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    if (filter === "available") return item.status === "available";
    if (filter === "soldOut") return item.status === "sold_out";
    return true;
  });

  // Sort items based on selected sort option
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sort === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sort === "priceLow") {
      return a.price - b.price;
    }
    if (sort === "priceHigh") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <ShopItemsFilter 
        currentFilter={filter} 
        setFilter={setFilter} 
        currentSort={sort} 
        setSort={setSort} 
      />
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse h-72">
              <CardContent className="p-0">
                <div className="h-40 bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/4 mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no items matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map(item => (
            <ShopItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
