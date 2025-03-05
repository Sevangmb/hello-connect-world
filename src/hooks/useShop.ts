
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { ShopStatus } from '@/core/shop/domain/types';

export const useShop = () => {
  const { user } = useAuth();
  const shopService = getShopService();
  const queryClient = useQueryClient();
  const [loadingAction, setLoadingAction] = useState(false);

  // Get current user's shop
  const {
    data: shop,
    isLoading: isShopLoading,
    refetch: refetchShop,
  } = useQuery({
    queryKey: ['user-shop', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await shopService.getShopByUserId(user.id);
    },
    enabled: !!user?.id,
  });

  // Create a shop
  const createShopMutation = useMutation({
    mutationFn: async (shopData: {
      name: string;
      description: string;
      image_url?: string;
      status: ShopStatus;
      user_id: string;
    }) => {
      return await shopService.createShop(shopData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-shop'] });
    },
  });

  // Update a shop
  const updateShopMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await shopService.updateShop(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-shop'] });
    },
  });

  // Get shop by ID
  const getShopById = useCallback(async (shopId: string) => {
    return await shopService.getShopById(shopId);
  }, [shopService]);

  // Get shop items
  const getShopItems = useCallback(async (shopId: string) => {
    return await shopService.getShopItems(shopId);
  }, [shopService]);

  // Create shop item
  const createShopItem = useCallback(async (itemData: any) => {
    return await shopService.createShopItem(itemData);
  }, [shopService]);

  // Update shop item
  const updateShopItem = useCallback(async (itemId: string, itemData: any) => {
    return await shopService.updateShopItem(itemId, itemData);
  }, [shopService]);

  // Delete shop item
  const deleteShopItem = useCallback(async (itemId: string) => {
    return await shopService.deleteShopItem(itemId);
  }, [shopService]);

  // Get shop reviews
  const getShopReviews = useCallback(async (shopId: string) => {
    return await shopService.getShopReviews(shopId);
  }, [shopService]);

  // Add item to cart
  const addToCart = useCallback(async (itemId: string, quantity = 1) => {
    setLoadingAction(true);
    try {
      if (!user?.id) throw new Error('User not logged in');
      
      // Here you would implement the actual add to cart functionality
      // For now we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoadingAction(false);
    }
  }, [user]);

  // Get shop orders
  const getShopOrders = useCallback(async (shopId: string) => {
    return await shopService.getShopOrders(shopId);
  }, [shopService]);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    return await shopService.updateOrderStatus(orderId, status);
  }, [shopService]);

  return {
    shop,
    isShopLoading,
    loadingAction,
    refetchShop,
    createShop: createShopMutation.mutate,
    updateShop: updateShopMutation.mutate,
    getShopById,
    getShopItems,
    createShopItem,
    updateShopItem,
    deleteShopItem,
    getShopReviews,
    addToCart,
    getShopOrders,
    updateOrderStatus
  };
};
