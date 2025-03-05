
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RawShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  shop_id: string;
  clothes_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  stock: number;
  original_price: number | null;
}

export interface UseShopItemsProps {
  shopId: string;
}

/**
 * Hook for fetching shop items for a specific shop
 */
export const useShopItems = ({ shopId }: UseShopItemsProps) => {
  return useQuery({
    queryKey: ['shop-items', shopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId)
        .eq('status', 'available');

      if (error) {
        throw new Error(error.message);
      }

      return data as RawShopItem[];
    },
  });
};
