
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/core/shop/domain/types";

export const useCartQuery = (userId: string | null) => {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items (
            id,
            name,
            price,
            image_url,
            shop_id
          ),
          shop: shop_items (
            id,
            name
          )
        `)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
      
      return data.map(item => ({
        id: item.id,
        user_id: userId,
        shop_id: item.shop_items?.shop_id,
        shop_item_id: item.shop_items?.id,
        quantity: item.quantity,
        created_at: item.created_at,
        updated_at: item.updated_at,
        shop_items: {
          id: item.shop_items?.id,
          name: item.shop_items?.name,
          price: item.shop_items?.price,
          image_url: item.shop_items?.image_url
        },
        shop: {
          id: item.shop_items?.shop_id,
          name: item.shop?.name || ""
        }
      })) as CartItem[];
    },
    enabled: !!userId,
  });
};
