
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
          id,
          quantity,
          shop_items (
            id,
            name,
            description,
            price,
            image_url,
            stock,
            shop_id
          )
        `)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        throw error;
      }
      
      // Transformer les données pour correspondre au type CartItem
      return (data as any[]).map(item => ({
        id: item.id,
        user_id: userId,
        shop_id: item.shop_items.shop_id,
        item_id: item.shop_items.id,
        quantity: item.quantity,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        shop_items: {
          id: item.shop_items.id,
          name: item.shop_items.name,
          price: item.shop_items.price,
          image_url: item.shop_items.image_url,
          shop_id: item.shop_items.shop_id
        },
        shop: {
          id: item.shop_items.shop_id,
          name: ""  // Ce champ sera rempli ultérieurement si nécessaire
        }
      })) as CartItem[];
    },
    enabled: !!userId,
  });
};
