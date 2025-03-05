
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShopItem, ShopItemStatus, RawShopItem } from '@/core/shop/domain/types';

interface ShopItemsQueryParams {
  shopId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  userId?: string;
}

// Définir une interface intermédiaire pour éviter la récursion de type
interface RawShopItemWithShop extends RawShopItem {
  shop?: {
    name: string;
  };
}

// Dans la fonction fetch, mapper correctement les données
const transformItems = (rawItems: RawShopItemWithShop[]): ShopItem[] => {
  return rawItems.map(item => ({
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
};

export const useShopItems = (params: ShopItemsQueryParams = {}) => {
  const { shopId, category, minPrice, maxPrice, sortBy, userId } = params;

  return useQuery({
    queryKey: ['shopItems', shopId, category, minPrice, maxPrice, sortBy, userId],
    queryFn: async () => {
      let query = supabase
        .from('shop_items')
        .select(`
          *,
          shop:shops (name)
        `);

      if (shopId) {
        query = query.eq('shop_id', shopId);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (minPrice !== undefined) {
        query = query.gte('price', minPrice);
      }

      if (maxPrice !== undefined) {
        query = query.lte('price', maxPrice);
      }

      // Gestion du tri
      if (sortBy) {
        const [field, direction] = sortBy.split(':');
        query = query.order(field, { ascending: direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erreur lors du chargement des articles: ${error.message}`);
      }

      return transformItems(data as RawShopItemWithShop[]);
    }
  });
};
