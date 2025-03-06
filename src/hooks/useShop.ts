import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shopApiGateway } from '@/services/api-gateway/ShopApiGateway';
import { Shop, ShopItem, Order, ShopStatus, OrderStatus, PaymentStatus } from '@/core/shop/domain/types';
import { useAuth } from './useAuth';

export const useShop = () => {
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  
  const getCurrentUserId = useCallback(() => {
    return auth?.user?.id || '';
  }, [auth?.user?.id]);

  // Get shop by ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        return shopApiGateway.getShopById(shopId);
      },
      enabled: !!shopId
    });
  };
  
  // Get current user's shop
  const useUserShop = () => {
    return useQuery({
      queryKey: ['user-shop', getCurrentUserId()],
      queryFn: async () => {
        if (!getCurrentUserId()) return null;
        return shopApiGateway.getShopByUserId(getCurrentUserId());
      },
      enabled: !!getCurrentUserId()
    });
  };
  
  // Get shops by status
  const useShopsByStatus = (status: ShopStatus) => {
    return useQuery({
      queryKey: ['shops', 'status', status],
      queryFn: () => shopApiGateway.getShopsByStatus(status)
    });
  };
  
  // Create a new shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Omit<Shop, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'average_rating'>) => {
        if (!getCurrentUserId()) throw new Error('User not authenticated');
        return shopApiGateway.createShop({
          ...shopData,
          user_id: getCurrentUserId(),
          average_rating: 0
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      }
    });
  };
  
  // Update an existing shop
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<Shop> }) => {
        return shopApiGateway.updateShop(id, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      }
    });
  };
  
  // Add shop items
  const useAddShopItems = () => {
    return useMutation({
      mutationFn: async ({ shopId, items }: { shopId: string; items: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>[] }) => {
        return shopApiGateway.addShopItems(shopId, items);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop-items', variables.shopId] });
      }
    });
  };
  
  // Update shop item
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ itemId, data }: { itemId: string; data: Partial<ShopItem> }) => {
        return shopApiGateway.updateShopItem(itemId, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop-item', variables.itemId] });
        queryClient.invalidateQueries({ queryKey: ['shop-items'] });
      }
    });
  };
  
  // Update shop item status
  const useUpdateShopItemStatus = () => {
    return useMutation({
      mutationFn: async ({ itemId, status }: { itemId: string; status: ShopItemStatus }) => {
        return shopApiGateway.updateShopItemStatus(itemId, status);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop-item', variables.itemId] });
        queryClient.invalidateQueries({ queryKey: ['shop-items'] });
      }
    });
  };
  
  // Get shop items for a shop
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-items', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopApiGateway.getShopItems(shopId);
      },
      enabled: !!shopId
    });
  };
  
  // Get a specific shop item
  const useShopItem = (itemId?: string) => {
    return useQuery({
      queryKey: ['shop-item', itemId],
      queryFn: async () => {
        if (!itemId) return null;
        return shopApiGateway.getShopItemById(itemId);
      },
      enabled: !!itemId
    });
  };
  
  // Get shop orders
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-orders', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopApiGateway.getShopOrders(shopId);
      },
      enabled: !!shopId
    });
  };
  
  // Update order status
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
        return shopApiGateway.updateOrderStatus(orderId, status);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
        queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      }
    });
  };

  // Get shop reviews
  const useShopReviews = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-reviews', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopApiGateway.getShopReviews(shopId);
      },
      enabled: !!shopId
    });
  };
  
  // Check if a shop is favorited
  const useIsShopFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-favorited', shopId, getCurrentUserId()],
      queryFn: async () => {
        if (!shopId || !getCurrentUserId()) return false;
        return shopApiGateway.isShopFavorited(getCurrentUserId(), shopId);
      },
      enabled: !!shopId && !!getCurrentUserId()
    });
  };
  
  // Get favorite shops
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favorite-shops', getCurrentUserId()],
      queryFn: async () => {
        if (!getCurrentUserId()) return [];
        return shopApiGateway.getFavoriteShops(getCurrentUserId());
      },
      enabled: !!getCurrentUserId()
    });
  };

  // Create a shop item
  const useCreateShopItem = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ shopId, item }: { 
        shopId: string, 
        item: Omit<ShopItem, "id" | "created_at" | "updated_at"> 
      }) => {
        const result = await shopApiGateway.createShopItem(shopId, item);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shop-items'] });
      }
    });
  };

  // Add a shop to favorites
  const useFavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!getCurrentUserId()) throw new Error('User not authenticated');
        return shopApiGateway.addShopToFavorites(getCurrentUserId(), shopId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorite-shops'] });
        queryClient.invalidateQueries({ queryKey: ['shop-favorited'] });
      }
    });
  };
  
  // Remove a shop from favorites
  const useUnfavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!getCurrentUserId()) throw new Error('User not authenticated');
        return shopApiGateway.removeShopFromFavorites(getCurrentUserId(), shopId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorite-shops'] });
        queryClient.invalidateQueries({ queryKey: ['shop-favorited'] });
      }
    });
  };

  return {
    useShopById,
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useShopsByStatus,
    useAddShopItems,
    useCreateShopItem,
    useUpdateShopItem,
    useUpdateShopItemStatus,
    useShopItems,
    useShopItem,
    useShopOrders,
    useUpdateOrderStatus,
    useShopReviews,
    useIsShopFavorited,
    useFavoriteShops,
    useFavoriteShop,
    useUnfavoriteShop
  };
};
