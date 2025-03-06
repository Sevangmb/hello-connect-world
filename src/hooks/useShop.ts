
import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Shop, ShopItem, ShopReview, ShopSettings, Order, CartItem, DbCartItem, OrderStatus } from '@/core/shop/domain/types';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { useAuth } from './useAuth';

export function useShop() {
  const { user } = useAuth();

  // UseUserShop hook
  const useUserShop = (userId?: string) => {
    const fetchUserShop = async () => {
      if (!userId) return null;
      return await shopService.getShopByUserId(userId);
    };

    return useQuery({
      queryKey: ['user-shop', userId],
      queryFn: fetchUserShop,
      enabled: !!userId
    });
  };

  // Get shop by ID
  const getShopById = async (shopId: string) => {
    return await shopService.getShopById(shopId);
  };

  // User shop mutations
  const useCreateShop = () => {
    const createShopMutation = useMutation({
      mutationFn: async (shopData: Partial<Shop>) => {
        return await shopService.createShop(shopData);
      },
    });

    return {
      ...createShopMutation,
      creating: createShopMutation.isPending,
      execute: createShopMutation.mutate
    };
  };

  const useUpdateShop = () => {
    const updateShopMutation = useMutation({
      mutationFn: async ({ shopId, shopData }: { shopId: string; shopData: Partial<Shop> }) => {
        return await shopService.updateShop(shopId, shopData);
      },
    });

    return {
      ...updateShopMutation,
      updating: updateShopMutation.isPending,
      execute: updateShopMutation.mutate
    };
  };

  // Shop items methods
  const getShopItems = async (shopId: string) => {
    return await shopService.getShopItems(shopId);
  };

  const useShopItems = (shopId: string) => {
    return useQuery({
      queryKey: ['shop-items', shopId],
      queryFn: () => getShopItems(shopId),
      enabled: !!shopId
    });
  };

  const useCreateShopItem = () => {
    const createShopItemMutation = useMutation({
      mutationFn: async (shopItem: Partial<ShopItem>) => {
        return await shopService.createShopItem(shopItem);
      }
    });

    return {
      ...createShopItemMutation,
      creating: createShopItemMutation.isPending,
      execute: createShopItemMutation.mutate
    };
  };

  const useAddShopItem = () => {
    const addItemMutation = useMutation({
      mutationFn: async (shopItem: Partial<ShopItem>) => {
        return await shopService.createShopItem(shopItem);
      }
    });

    return {
      ...addItemMutation,
      creating: addItemMutation.isPending,
      execute: addItemMutation.mutate
    };
  };

  const useUpdateShopItem = () => {
    const updateItemMutation = useMutation({
      mutationFn: async ({ itemId, itemData }: { itemId: string, itemData: Partial<ShopItem> }) => {
        return await shopService.updateShopItem(itemId, itemData);
      }
    });

    return {
      ...updateItemMutation,
      updating: updateItemMutation.isPending
    };
  };

  const useDeleteShopItem = () => {
    const deleteItemMutation = useMutation({
      mutationFn: async (itemId: string) => {
        return await shopService.deleteShopItem(itemId);
      }
    });

    return {
      ...deleteItemMutation,
      deleting: deleteItemMutation.isPending
    };
  };

  // Shop reviews methods
  const getShopReviews = async (shopId: string) => {
    return await shopService.getShopReviews(shopId);
  };

  const useAddShopReview = () => {
    const addReviewMutation = useMutation({
      mutationFn: async (review: Partial<ShopReview>) => {
        return await shopService.createShopReview(review);
      }
    });

    return {
      ...addReviewMutation
    };
  };

  // Shop settings methods
  const getShopSettings = async (shopId: string) => {
    return await shopService.getShopSettings(shopId);
  };

  const updateShopSettings = async (shopId: string, settings: Partial<ShopSettings>) => {
    return await shopService.updateShopSettings(shopId, settings);
  };

  // Order methods
  const getOrdersByShopId = async (shopId: string, status?: OrderStatus) => {
    if (shopService.getOrdersByShopId) {
      return await shopService.getOrdersByShopId(shopId, status);
    }
    return [];
  };

  const getUserOrders = async (userId: string, status?: OrderStatus) => {
    if (shopService.getUserOrders) {
      return await shopService.getUserOrders(userId, status);
    }
    return [];
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (shopService.updateOrderStatus) {
      return await shopService.updateOrderStatus(orderId, status);
    }
    return false;
  };

  // Cart methods
  const useAddToCart = () => {
    const addToCartMutation = useMutation({
      mutationFn: async (params: { userId: string, shopItemId: string, quantity: number }) => {
        const { userId, shopItemId, quantity } = params;
        return await shopService.addToCart(userId, shopItemId, quantity);
      }
    });

    return {
      ...addToCartMutation
    };
  };

  return {
    useUserShop,
    useCreateShop,
    useUpdateShop,
    getShopById,
    getShopItems,
    useShopItems,
    useCreateShopItem,
    useAddShopItem,
    useUpdateShopItem,
    useDeleteShopItem,
    getShopReviews,
    useAddShopReview,
    getShopSettings,
    updateShopSettings,
    getOrdersByShopId,
    getUserOrders,
    updateOrderStatus,
    useAddToCart
  };
}
