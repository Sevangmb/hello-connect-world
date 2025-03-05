
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RawShopItem, ShopItem, ShopItemStatus } from '@/core/shop/domain/types';

interface ShopItemsQueryParams {
  shopId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  userId?: string;
}

export const useShopItems = (params?: ShopItemsQueryParams) => {
  const fetchShopItems = async (): Promise<ShopItem[]> => {
    let query = supabase
      .from('shop_items')
      .select(`
        *,
        shop:shops(name)
      `);
    
    // Apply filters
    if (params?.shopId) {
      query = query.eq('shop_id', params.shopId);
    }
    
    if (params?.category) {
      // If we want to filter by category, we need to join with clothes table
      query = query.eq('category', params.category);
    }
    
    if (params?.minPrice !== undefined) {
      query = query.gte('price', params.minPrice);
    }
    
    if (params?.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice);
    }
    
    // Always filter to only show available items
    query = query.eq('status', 'available');
    
    // Apply sorting
    if (params?.sortBy) {
      const [field, direction] = params.sortBy.split(':');
      query = query.order(field, { ascending: direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching shop items:', error);
      throw new Error('Failed to fetch shop items');
    }
    
    if (!data) return [];
    
    // Transform raw data to match our domain model
    const items: ShopItem[] = (data as RawShopItem[]).map(item => ({
      id: item.id,
      shop_id: item.shop_id,
      name: item.name || '',
      description: item.description || '',
      price: item.price,
      original_price: item.original_price,
      stock: item.stock,
      image_url: item.image_url,
      status: item.status as ShopItemStatus,
      created_at: item.created_at,
      updated_at: item.updated_at,
      clothes_id: item.clothes_id,
      shop: {
        name: item.shop?.name || ''
      }
    }));
    
    return items;
  };
  
  return useQuery({
    queryKey: ['shop-items', params],
    queryFn: fetchShopItems
  });
};
