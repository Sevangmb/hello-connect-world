
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShopItemStatus } from '@/core/shop/domain/types';

export interface RawShopItem {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  stock: number;
  status: ShopItemStatus;
  created_at: string;
  updated_at: string;
  clothes_id?: string;
}

export interface UseShopItemsProps {
  shopId?: string;
  limit?: number;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    category?: string;
  };
}

export const useShopItems = ({
  shopId,
  limit = 20,
  filters
}: UseShopItemsProps = {}) => {
  const [totalItems, setTotalItems] = useState(0);

  const fetchShopItems = async (): Promise<RawShopItem[]> => {
    let query = supabase
      .from('shop_items')
      .select('*', { count: 'exact' });
    
    if (shopId) {
      query = query.eq('shop_id', shopId);
    }
    
    // Add active status filter by default
    query = query.eq('status', 'available');
    
    // Apply price filters
    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    
    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }
    
    // Apply sorting
    if (filters?.sort) {
      switch (filters.sort) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      // Default sort by newest
      query = query.order('created_at', { ascending: false });
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching shop items:', error);
      throw new Error('Failed to fetch shop items');
    }
    
    if (count !== null) {
      setTotalItems(count);
    }
    
    return data || [];
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['shopItems', shopId, limit, filters],
    queryFn: fetchShopItems,
  });

  return {
    items: data || [],
    isLoading,
    error,
    totalItems,
    refetch
  };
};
