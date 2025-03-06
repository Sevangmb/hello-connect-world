
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { shopApiGateway } from '@/services/api-gateway/ShopApiGateway';
import { Shop, ShopItem, ShopItemStatus, ShopStatus } from '@/core/shop/domain/types';

/**
 * Hook for shop-related operations
 */
export const useShop = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Get a specific shop by ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        const shop = await shopApiGateway.getShopById(shopId);
        return shop;
      },
      enabled: !!shopId,
    });
  };

  // Get the current user's shop
  const useUserShop = () => {
    return useQuery({
      queryKey: ['user-shop', userId],
      queryFn: async () => {
        if (!userId) return null;
        const shop = await shopApiGateway.getShopByUserId(userId);
        return shop;
      },
      enabled: !!userId,
    });
  };

  // Create a new shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>) => {
        if (!userId) throw new Error('User not authenticated');
        return await shopApiGateway.createShop({
          ...shopData,
          user_id: userId,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      },
    });
  };

  // Update an existing shop
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ 
        shopId, shopData 
      }: { 
        shopId: string; 
        shopData: Partial<Shop> 
      }) => {
        return await shopApiGateway.updateShop(shopId, shopData);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      },
    });
  };

  // Add an item to a shop
  const useAddShopItem = () => {
    return useMutation({
      mutationFn: async ({ 
        shopId, item 
      }: { 
        shopId: string; 
        item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'> 
      }) => {
        // We need to ensure shop_id is set properly
        return await shopApiGateway.addShopItems(shopId, [item]);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop-items', variables.shopId] });
      },
    });
  };

  // Update a shop item
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ 
        itemId, itemData 
      }: { 
        itemId: string; 
        itemData: Partial<ShopItem> 
      }) => {
        return await shopApiGateway.updateShopItem(itemId, itemData);
      },
      onSuccess: (result) => {
        if (result) {
          queryClient.invalidateQueries({ queryKey: ['shop-items', result.shop_id] });
          queryClient.invalidateQueries({ queryKey: ['shop-item', result.id] });
        }
      },
    });
  };

  // Update an item's status
  const useUpdateShopItemStatus = () => {
    return useMutation({
      mutationFn: async ({ 
        itemId, status 
      }: { 
        itemId: string; 
        status: ShopItemStatus 
      }) => {
        return await shopApiGateway.updateShopItemStatus(itemId, status);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop-item', variables.itemId] });
        // Since we don't know the shop ID here, we may need to invalidate all shop items
        queryClient.invalidateQueries({ queryKey: ['shop-items'] });
      },
    });
  };

  // Get items for a shop
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-items', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return await shopApiGateway.getShopItems(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Get a specific shop item
  const useShopItem = (itemId?: string) => {
    return useQuery({
      queryKey: ['shop-item', itemId],
      queryFn: async () => {
        if (!itemId) return null;
        return await shopApiGateway.getShopItemById(itemId);
      },
      enabled: !!itemId,
    });
  };

  // Get orders for a shop
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-orders', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return await shopApiGateway.getShopOrders(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Get all shops
  const useShops = () => {
    return useQuery({
      queryKey: ['shops'],
      queryFn: async () => {
        return await shopApiGateway.getAllShops();
      },
    });
  };

  // Add item to cart
  const useAddToCart = () => {
    return useMutation({
      mutationFn: async ({ 
        itemId, quantity 
      }: { 
        itemId: string; 
        quantity: number 
      }) => {
        if (!userId) throw new Error('User not authenticated');
        return await shopApiGateway.addToCart(userId, itemId, quantity);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      },
    });
  };

  // Check if shop is favorited
  const useIsShopFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-favorited', shopId, userId],
      queryFn: async () => {
        if (!shopId || !userId) return false;
        return await shopApiGateway.isShopFavorited(userId, shopId);
      },
      enabled: !!shopId && !!userId,
    });
  };

  // Favorite a shop
  const useFavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!userId) throw new Error('User not authenticated');
        return await shopApiGateway.addToFavorites(userId, shopId);
      },
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['shop-favorited', shopId, userId] });
        queryClient.invalidateQueries({ queryKey: ['favorite-shops'] });
      },
    });
  };

  // Unfavorite a shop
  const useUnfavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!userId) throw new Error('User not authenticated');
        return await shopApiGateway.removeFromFavorites(userId, shopId);
      },
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['shop-favorited', shopId, userId] });
        queryClient.invalidateQueries({ queryKey: ['favorite-shops'] });
      },
    });
  };

  // Get favorite shops
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favorite-shops', userId],
      queryFn: async () => {
        if (!userId) return [];
        return await shopApiGateway.getFavoriteShops(userId);
      },
      enabled: !!userId,
    });
  };

  return {
    useShopById,
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useAddShopItem,
    useUpdateShopItem,
    useUpdateShopItemStatus,
    useShopItems,
    useShopItem,
    useShopOrders,
    useShops,
    useAddToCart,
    useIsShopFavorited,
    useFavoriteShop,
    useUnfavoriteShop,
    useFavoriteShops,
  };
};
