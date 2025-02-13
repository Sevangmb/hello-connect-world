
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckoutButton } from "./CheckoutButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  shop_id: string;
  seller_id: string;
  category?: string;
  size?: string;
  brand?: string;
}

export function ShopItems({ shopId }: { shopId: string }) {
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["shop-items", shopId, sortBy, searchQuery],
    queryFn: async () => {
      // D'abord, vérifier les vêtements directement liés à la boutique
      const { data: shopItems, error: shopItemsError } = await supabase
        .from('shop_items')
        .select(`
          *,
          clothes (
            name,
            description,
            image_url,
            category,
            size,
            brand
          ),
          shop:shops (
            name,
            user_id
          )
        `)
        .eq('shop_id', shopId)
        .eq('status', 'available')
        .order('created_at', sortBy === 'recent' ? { ascending: false } : undefined)
        .order('price', sortBy === 'price_asc' ? { ascending: true } : sortBy === 'price_desc' ? { ascending: false } : undefined);

      if (shopItemsError) throw shopItemsError;

      const filteredItems = shopItems.filter(item => 
        !searchQuery || 
        item.clothes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.clothes.description && item.clothes.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      return filteredItems;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Chargement des articles...
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="text-center py-8 text-gray-600">
        Aucun article en vente dans cette boutique
      </div>
    );
  }

  const processedItems: ShopItem[] = items.map(item => ({
    id: item.id,
    name: item.clothes.name,
    description: item.clothes.description,
    price: item.price,
    image: item.clothes.image_url,
    shop_id: item.shop_id,
    seller_id: item.shop.user_id,
    category: item.clothes.category,
    size: item.clothes.size,
    brand: item.clothes.brand
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          type="search"
          placeholder="Rechercher des articles..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="price_asc">Prix croissant</SelectItem>
            <SelectItem value="price_desc">Prix décroissant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {processedItems.map((item) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
          >
            {item.image && (
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
              </div>
            )}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.name}</h3>
                <p className="text-lg font-semibold">{item.price}€</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.size && (
                  <Badge variant="outline" className="text-xs">
                    {item.size}
                  </Badge>
                )}
                {item.brand && (
                  <Badge variant="secondary" className="text-xs">
                    {item.brand}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {processedItems.length > 0 && (
        <div className="mt-6">
          <CheckoutButton items={processedItems} />
        </div>
      )}
    </div>
  );
}
