
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  original_price?: number;
}

export function ShopItems({ shopId }: { shopId: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart, loading: addingToCart } = useCart();
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["shop-items", shopId, sortBy, searchQuery],
    queryFn: async () => {
      console.log("[ShopItems] Fetching items for shop:", shopId);

      // D'abord, vérifions que le shop existe
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id, name')
        .eq('id', shopId)
        .single();

      if (shopError) {
        console.error("[ShopItems] Error fetching shop:", shopError);
        throw shopError;
      }

      console.log("[ShopItems] Shop found:", shop);

      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          id,
          price,
          original_price,
          status,
          created_at,
          clothes!clothes_id (
            name,
            description,
            image_url,
            category,
            size,
            brand,
            original_price
          ),
          shop:shop_id (
            id,
            name,
            user_id
          )
        `)
        .eq('shop_id', shopId)
        .eq('status', 'available');

      console.log("[ShopItems] Query results:", { data, error }); 

      if (error) {
        console.error("[ShopItems] Error fetching shop items:", error);
        throw error;
      }

      if (!data) {
        console.log("[ShopItems] No data returned");
        return [];
      }

      // Filter based on search query
      const filteredItems = data.filter(item => 
        !searchQuery || 
        item.clothes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.clothes.description && item.clothes.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      console.log("[ShopItems] Filtered items:", filteredItems);

      // Apply sorting
      return filteredItems.sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'price_asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price_desc') {
          return b.price - a.price;
        }
        return 0;
      });
    },
  });

  const handleAddToCart = async (item: any) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des articles au panier",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    addToCart.mutate({
      shopItemId: item.id,
      quantity: 1
    });
  };

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
    shop_id: item.shop.id,
    seller_id: item.shop.user_id,
    category: item.clothes.category,
    size: item.clothes.size,
    brand: item.clothes.brand,
    original_price: item.original_price || item.clothes.original_price
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <Input
          type="search"
          placeholder="Rechercher des articles..."
          className="max-w-xs border-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] border-gray-300">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="price_asc">Prix croissant</SelectItem>
            <SelectItem value="price_desc">Prix décroissant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {processedItems.map((item) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            {item.image && (
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold">{formatPrice(item.price)}</span>
                  {item.original_price && item.original_price > item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(item.original_price)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {item.size && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {item.size}
                  </Badge>
                )}
                {item.brand && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {item.brand}
                  </Badge>
                )}
              </div>
              <Button 
                className="w-full bg-black hover:bg-gray-900 text-white"
                size="sm"
                onClick={() => handleAddToCart(item)}
                disabled={addingToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajouter au panier
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
