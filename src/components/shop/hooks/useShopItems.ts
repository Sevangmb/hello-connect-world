
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShopItem, ShopItemStatus, RawShopItem } from '@/core/shop/domain/types';

export interface ShopItemsFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const useShopItems = (filters: ShopItemsFilters = {}) => {
  return useQuery({
    queryKey: ['shopItems', filters],
    queryFn: async () => {
      let query = supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            name
          )
        `)
        .eq('status', 'available');

      if (filters.category) {
        // We would need to join with the clothes table to filter by category
        // For simplicity, we'll filter client-side in this example
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching shop items:', error);
        throw new Error('Failed to fetch shop items');
      }

      // Convert string status to enum and handle shop data
      const items = data.map((item): ShopItem => ({
        ...item,
        status: item.status as ShopItemStatus,
        shop: {
          name: item.shop?.name || 'Unknown Shop'
        }
      }));

      return items;
    }
  });
};

export const useShopItemsByShopId = (shopId: string | null) => {
  return useQuery({
    queryKey: ['shopItems', shopId],
    queryFn: async () => {
      if (!shopId) return [];

      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            name
          )
        `)
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching shop items by shop ID:', error);
        throw new Error('Failed to fetch shop items');
      }

      // Convert string status to enum and handle shop data
      const items = data.map((item): ShopItem => ({
        ...item,
        status: item.status as ShopItemStatus,
        shop: {
          name: item.shop?.name || 'Unknown Shop'
        }
      }));

      return items;
    },
    enabled: !!shopId
  });
};

export const useShopItemById = (itemId: string | null) => {
  return useQuery({
    queryKey: ['shopItem', itemId],
    queryFn: async () => {
      if (!itemId) return null;

      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            name
          )
        `)
        .eq('id', itemId)
        .single();

      if (error) {
        console.error('Error fetching shop item by ID:', error);
        throw new Error('Failed to fetch shop item');
      }

      // Convert string status to enum and handle shop data
      const item: ShopItem = {
        ...data,
        status: data.status as ShopItemStatus,
        shop: {
          name: data.shop?.name || 'Unknown Shop'
        }
      };

      return item;
    },
    enabled: !!itemId
  });
};
