import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShopService } from '@/core/shop/application/ShopService';
import type { Shop, ShopItem, ShopSettings } from '@/core/shop/domain/types';

export const useShop = () => {
  const queryClient = useQueryClient();
  const shopService = new ShopService();

  const createShop = useMutation({
    mutationFn: (data: Partial<Shop>) => shopService.createShop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    }
  });

  const updateShop = useMutation({
    mutationFn: (data: { id: string; data: Partial<Shop> }) => 
      shopService.updateShop(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    }
  });

  const useUserShop = (userId: string) => {
    return useQuery({
      queryKey: ['userShop', userId],
      queryFn: () => shopService.getUserShop(userId),
    });
  };

  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: (data: Partial<ShopItem>) => shopService.createShopItem(data),
      onSuccess: (newItem, variables, context) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', newItem.shop_id] });
      },
    });
  };

  const useShopItems = (shopId: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: () => shopService.getShopItems(shopId),
    });
  };

  const useShopItem = (itemId: string) => {
    return useQuery({
      queryKey: ['shopItem', itemId],
      queryFn: () => shopService.getShopItemById(itemId),
    });
  };

  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: (data: { id: string; data: Partial<ShopItem> }) =>
        shopService.updateShopItem(data.id, data.data),
      onSuccess: (updatedItem, variables, context) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', updatedItem.shop_id] });
      },
    });
  };

  const getShopReviews = (shopId: string) => {
    return useQuery({
      queryKey: ['shopReviews', shopId],
      queryFn: () => shopService.getShopReviews(shopId),
    });
  };

  const useCreateShopReview = () => {
    return useMutation({
      mutationFn: (data: Partial<any>) => shopService.createShopReview(data),
      onSuccess: (newReview, variables, context) => {
        queryClient.invalidateQueries({ queryKey: ['shopReviews', newReview.shop_id] });
      },
    });
  };

  const getShopSettings = (shopId: string) => {
    return useQuery({
      queryKey: ['shopSettings', shopId],
      queryFn: () => shopService.getShopSettings(shopId),
    });
  };

  const updateShopSettings = () => {
    return useMutation({
      mutationFn: (data: { shopId: string, settings: Partial<ShopSettings> }) =>
        shopService.updateShopSettings(data.shopId, data.settings),
      onSuccess: (updatedSettings, variables, context) => {
        queryClient.invalidateQueries({ queryKey: ['shopSettings', updatedSettings.shop_id] });
      },
    });
  };

  return {
    createShop,
    updateShop,
    useUserShop,
    useCreateShopItem,
    useShopItems,
    useShopItem,
    useUpdateShopItem,
    getShopReviews,
    useCreateShopReview,
    getShopSettings,
    updateShopSettings
  };
};
