
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShopItem, ShopItemStatus } from '@/core/shop/domain/types';

interface FilterOptions {
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

// Interface for raw item data from database
interface RawShopItemWithShop {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  status: string;
  created_at: string;
  updated_at: string;
  clothes_id: string | null;
  shop: {
    id: string;
    name: string;
    user_id: string;
  };
}

// Transform function to convert raw shop item to the expected format
const transformShopItem = (item: RawShopItemWithShop): ShopItem => {
  return {
    id: item.id,
    shop_id: item.shop_id,
    name: item.name,
    description: item.description || '',
    price: item.price,
    original_price: item.original_price || undefined,
    stock: item.stock,
    image_url: item.image_url || undefined,
    status: item.status as ShopItemStatus,
    created_at: item.created_at,
    updated_at: item.updated_at,
    clothes_id: item.clothes_id || undefined,
    shop: item.shop
  };
};

// Main hook to fetch and filter shop items
export const useShopItems = (filters: FilterOptions = {}) => {
  return useQuery({
    queryKey: ['shopItems', filters],
    queryFn: async () => {
      let query = supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            id,
            name,
            user_id
          )
        `)
        .eq('status', 'available');

      // Apply price filters
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      
      // Apply category filter if provided
      if (filters.category) {
        // This assumes shop_items has a category field or linked to a categories table
        query = query.eq('category', filters.category);
      }
      
      // Fetch the data
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching shop items:', error);
        throw error;
      }
      
      // Transform the data
      let shopItems = (data || []).map(transformShopItem);
      
      // Apply sorting
      if (filters.sort) {
        shopItems = sortShopItems(shopItems, filters.sort);
      }
      
      return shopItems;
    }
  });
};

// Sort function
const sortShopItems = (items: ShopItem[], sortOption: string): ShopItem[] => {
  return [...items].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });
};
