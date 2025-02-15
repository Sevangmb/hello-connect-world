
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RawShopItem, ShopItem } from "../types/shop-items";

interface UseShopItemsProps {
  shopId: string;
  sortBy: string;
  searchQuery: string;
}

export function useShopItems({ shopId, sortBy, searchQuery }: UseShopItemsProps) {
  return useQuery({
    queryKey: ["shop-items", shopId, sortBy, searchQuery],
    queryFn: async () => {
      console.log("[ShopItems] Fetching items for shop:", shopId);

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
          clothes!shop_items_clothes_id_fkey (
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

      if (error) {
        console.error("[ShopItems] Error fetching shop items:", error);
        throw error;
      }

      if (!data) {
        console.log("[ShopItems] No data returned");
        return [];
      }

      const items = data as RawShopItem[];

      // Filter based on search query
      const filteredItems = items.filter(item => 
        !searchQuery || 
        item.clothes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.clothes.description && item.clothes.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

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
}
