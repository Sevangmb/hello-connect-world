
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopReview, ShopSettings } from '@/core/shop/domain/types';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';

export const useShop = () => {
  const queryClient = useQueryClient();

  // Get shop by ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        return shopService.getShopById(shopId);
      },
      enabled: !!shopId
    });
  };

  // Get shop for current user
  const useUserShop = () => {
    return useQuery({
      queryKey: ['userShop'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        return shopService.getShopByUserId(user.id);
      }
    });
  };

  // Create shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Partial<Shop>) => {
        return shopService.createShop(shopData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
      }
    });
  };

  // Update shop
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ shopId, data }: { shopId: string, data: Partial<Shop> }) => {
        return shopService.updateShop(shopId, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
      }
    });
  };

  // Get shop items
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopService.getShopItemsByShopId(shopId);
      },
      enabled: !!shopId
    });
  };

  // Create shop item
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: async (itemData: Partial<ShopItem>) => {
        return shopService.createShopItem(itemData);
      },
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['shopItems', data.shop_id] });
        }
      }
    });
  };

  // Update shop item
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ itemId, data }: { itemId: string, data: Partial<ShopItem> }) => {
        return shopService.updateShopItem(itemId, data);
      },
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['shopItems', data.shop_id] });
        }
      }
    });
  };

  // Delete shop item
  const useDeleteShopItem = () => {
    return useMutation({
      mutationFn: async ({ itemId, shopId }: { itemId: string, shopId: string }) => {
        return shopService.deleteShopItem(itemId);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', variables.shopId] });
      }
    });
  };

  // Get shop reviews
  const useShopReviews = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopReviews', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopService.getShopReviewsByShopId(shopId);
      },
      enabled: !!shopId
    });
  };

  // Create shop review
  const useCreateShopReview = () => {
    return useMutation({
      mutationFn: async (reviewData: Partial<ShopReview>) => {
        return shopService.createShopReview(reviewData);
      },
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['shopReviews', data.shop_id] });
          queryClient.invalidateQueries({ queryKey: ['shop', data.shop_id] });
        }
      }
    });
  };

  // Get shop settings
  const useShopSettings = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopSettings', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        return shopService.getShopSettings(shopId);
      },
      enabled: !!shopId
    });
  };

  // Update shop settings
  const useUpdateShopSettings = () => {
    return useMutation({
      mutationFn: async ({ shopId, settings }: { shopId: string, settings: Partial<ShopSettings> }) => {
        return shopService.updateShopSettings(shopId, settings);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopSettings', variables.shopId] });
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
      }
    });
  };

  // Get favorite shops
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favoriteShops'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('user_favorite_shops')
          .select('shop_id, shops(*)');
          
        if (error) throw error;
        
        return data.map(item => item.shops) as Shop[];
      }
    });
  };

  return {
    useShopById,
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useShopItems,
    useCreateShopItem,
    useUpdateShopItem,
    useDeleteShopItem,
    useShopReviews,
    useCreateShopReview,
    useShopSettings,
    useUpdateShopSettings,
    useFavoriteShops
  };
};
