
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShopService } from '@/core/shop/application/ShopService';
import { ShopRepository } from '@/core/shop/infrastructure/ShopRepository';
import type { Shop, ShopItem, ShopSettings, ShopReview } from '@/core/shop/domain/types';

export const useShop = () => {
  const queryClient = useQueryClient();
  const shopRepository = new ShopRepository();
  const shopService = new ShopService(shopRepository);

  // Mutations
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

  // Queries and custom hooks
  const getUserShop = (userId: string) => {
    return useQuery({
      queryKey: ['userShop', userId],
      queryFn: () => shopService.getUserShop(userId),
      enabled: !!userId
    });
  };

  const getShopById = (shopId: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: () => shopService.getShopById(shopId),
      enabled: !!shopId
    });
  };

  const createShopItem = useMutation({
    mutationFn: (data: Partial<ShopItem>) => shopService.createShopItem(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['shopItems', newItem.shop_id] });
    }
  });

  const getShopItems = (shopId: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: () => shopService.getShopItems(shopId),
      enabled: !!shopId
    });
  };

  const getShopItem = (itemId: string) => {
    return useQuery({
      queryKey: ['shopItem', itemId],
      queryFn: () => shopService.getShopItemById(itemId),
      enabled: !!itemId
    });
  };

  const updateShopItem = useMutation({
    mutationFn: (data: { id: string; data: Partial<ShopItem> }) =>
      shopService.updateShopItem(data.id, data.data),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: ['shopItems', updatedItem.shop_id] });
      queryClient.invalidateQueries({ queryKey: ['shopItem', updatedItem.id] });
    }
  });

  const getShopReviews = (shopId: string) => {
    return useQuery({
      queryKey: ['shopReviews', shopId],
      queryFn: () => shopService.getShopReviews(shopId),
      enabled: !!shopId
    });
  };

  const createShopReview = useMutation({
    mutationFn: (data: Partial<ShopReview>) => shopService.createShopReview(data),
    onSuccess: (newReview) => {
      queryClient.invalidateQueries({ queryKey: ['shopReviews', newReview.shop_id] });
    }
  });

  const getShopSettings = (shopId: string) => {
    return useQuery({
      queryKey: ['shopSettings', shopId],
      queryFn: () => shopService.getShopSettings(shopId),
      enabled: !!shopId
    });
  };

  const updateShopSettings = useMutation({
    mutationFn: (data: { shopId: string, settings: Partial<ShopSettings> }) =>
      shopService.updateShopSettings(data.shopId, data.settings),
    onSuccess: (updatedSettings) => {
      queryClient.invalidateQueries({ queryKey: ['shopSettings', updatedSettings.shop_id] });
    }
  });

  return {
    createShop,
    updateShop,
    getUserShop,
    getShopById,
    createShopItem,
    getShopItems,
    getShopItem,
    updateShopItem,
    getShopReviews,
    createShopReview,
    getShopSettings,
    updateShopSettings
  };
};
