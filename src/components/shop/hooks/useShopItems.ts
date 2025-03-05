
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShopItem, ShopItemStatus } from '@/core/shop/domain/types';

interface ShopItemsFilter {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  category?: string;
}

export const useShopItems = () => {
  const [filter, setFilter] = useState<ShopItemsFilter>({});

  const fetchShopItems = async () => {
    let query = supabase
      .from('shop_items')
      .select(`
        *,
        shop:shop_id (
          name
        )
      `)
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    // Apply search filter
    if (filter.search) {
      query = query.ilike('name', `%${filter.search}%`);
    }

    // Apply price filters
    if (filter.minPrice !== undefined) {
      query = query.gte('price', filter.minPrice);
    }
    if (filter.maxPrice !== undefined) {
      query = query.lte('price', filter.maxPrice);
    }

    // Apply sorting
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        // For 'popular' we would need additional data like sales count
        default:
          query = query.order('created_at', { ascending: false });
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching shop items:', error);
      throw error;
    }

    // Map the data to our ShopItem type
    return data.map(item => ({
      id: item.id,
      shop_id: item.shop_id,
      name: item.name || '',
      description: item.description || '',
      price: item.price,
      original_price: item.original_price,
      stock: item.stock,
      status: item.status as ShopItemStatus,
      image_url: item.image_url || '',
      clothes_id: item.clothes_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      shop: item.shop
    })) as ShopItem[];
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['shopItems', filter],
    queryFn: fetchShopItems,
  });

  return {
    data,
    isLoading,
    error,
    filter,
    setFilter,
    refetch
  };
};
