
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShopApiGateway } from '@/services/api-gateway/ShopApiGateway';
import { ShopService } from '@/core/shop/application/ShopService';
import { Shop, ShopItem, ShopItemStatus, Order, ShopReview } from '@/core/shop/domain/types';
import { useAuth } from './useAuth';

// Initialize services
const shopService = new ShopService();
const shopApiGateway = new ShopApiGateway(shopService);

export const useShop = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query: Get shop by ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        const shop = await shopApiGateway.getShopById(shopId);
        if (!shop) throw new Error('Shop not found');
        return shop;
      },
      enabled: !!shopId
    });
  };

  // Query: Get user's shop
  const useUserShop = () => {
    return useQuery({
      queryKey: ['userShop', user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User must be authenticated');
        const shop = await shopApiGateway.getUserShop(user.id);
        return shop;
      },
      enabled: !!user?.id
    });
  };

  // Mutation: Create shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Partial<Shop>) => {
        if (!user?.id) throw new Error('User must be authenticated');
        
        const newShop = {
          ...shopData,
          user_id: user.id,
          status: 'pending' as const
        };
        
        return shopApiGateway.createShop(newShop);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
      }
    });
  };

  // Mutation: Update shop
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ shopId, data }: { shopId: string; data: Partial<Shop> }) => {
        return shopApiGateway.updateShop(shopId, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
      }
    });
  };

  // Mutation: Add shop items
  const useAddShopItems = () => {
    return useMutation({
      mutationFn: async ({ shopId, item }: { shopId: string; item: Omit<ShopItem, "id" | "created_at" | "updated_at"> }) => {
        // Ensure shop_id is set in the item
        const itemWithShopId = {
          ...item,
          shop_id: shopId
        };
        
        return shopApiGateway.createShopItem(shopId, itemWithShopId);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', variables.shopId] });
      }
    });
  };

  // Mutation: Update shop item
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ itemId, data }: { itemId: string; data: Partial<ShopItem> }) => {
        return shopApiGateway.updateShopItem(itemId, data);
      },
      onSuccess: (_, variables) => {
        // We don't know which shop this item belongs to, so invalidate all shop items queries
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
        queryClient.invalidateQueries({ queryKey: ['shopItem', variables.itemId] });
      }
    });
  };

  // Mutation: Update shop item status
  const useUpdateShopItemStatus = () => {
    return useMutation({
      mutationFn: async ({ itemId, status }: { itemId: string; status: ShopItemStatus }) => {
        return shopApiGateway.updateShopItemStatus(itemId, status);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
        queryClient.invalidateQueries({ queryKey: ['shopItem', variables.itemId] });
      }
    });
  };

  // Query: Get shop items
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        return shopApiGateway.getShopItems(shopId);
      },
      enabled: !!shopId
    });
  };

  // Query: Get shop item by ID
  const useShopItemById = (itemId?: string) => {
    return useQuery({
      queryKey: ['shopItem', itemId],
      queryFn: async () => {
        if (!itemId) throw new Error('Item ID is required');
        const item = await shopApiGateway.getShopItemById(itemId);
        if (!item) throw new Error('Item not found');
        return item;
      },
      enabled: !!itemId
    });
  };

  // Query: Get shop orders
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopOrders', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        return shopApiGateway.getOrdersByShop(shopId);
      },
      enabled: !!shopId
    });
  };

  // Query: Get user's favorite shops
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favoriteShops', user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User must be authenticated');
        
        const { data, error } = await supabase
          .from('user_favorite_shops')
          .select('shop_id')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Return an empty array if no favorites
        if (!data || data.length === 0) return [];
        
        // Get shop details for each favorite
        const shopIds = data.map(favorite => favorite.shop_id);
        const shopsPromises = shopIds.map(id => shopApiGateway.getShopById(id));
        const shops = await Promise.all(shopsPromises);
        
        // Filter out null values
        return shops.filter(Boolean) as Shop[];
      },
      enabled: !!user?.id
    });
  };

  // Check if a shop is favorited by the user
  const useIsShopFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['isShopFavorited', user?.id, shopId],
      queryFn: async () => {
        if (!user?.id || !shopId) return false;
        
        const { data, error } = await supabase
          .from('user_favorite_shops')
          .select('*')
          .eq('user_id', user.id)
          .eq('shop_id', shopId)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        
        return !!data;
      },
      enabled: !!user?.id && !!shopId
    });
  };

  // Mutation: Favorite a shop
  const useFavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('User must be authenticated');
        
        const { error } = await supabase
          .from('user_favorite_shops')
          .insert({ user_id: user.id, shop_id: shopId });
          
        if (error) throw error;
        return true;
      },
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['isShopFavorited', user?.id, shopId] });
        queryClient.invalidateQueries({ queryKey: ['favoriteShops', user?.id] });
      }
    });
  };

  // Mutation: Unfavorite a shop
  const useUnfavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('User must be authenticated');
        
        const { error } = await supabase
          .from('user_favorite_shops')
          .delete()
          .eq('user_id', user.id)
          .eq('shop_id', shopId);
          
        if (error) throw error;
        return true;
      },
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['isShopFavorited', user?.id, shopId] });
        queryClient.invalidateQueries({ queryKey: ['favoriteShops', user?.id] });
      }
    });
  };

  return {
    useShopById,
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useAddShopItems,
    useUpdateShopItem,
    useUpdateShopItemStatus,
    useShopItems,
    useShopItemById,
    useShopOrders,
    useFavoriteShops,
    useIsShopFavorited,
    useFavoriteShop,
    useUnfavoriteShop
  };
};
