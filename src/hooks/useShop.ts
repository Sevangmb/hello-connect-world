
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, ShopItemStatus, ShopStatus, Order, OrderStatus, PaymentStatus } from '@/core/shop/domain/types';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export const useShop = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const shopService = getShopService();
  
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
  
  // Get current user's shop
  const useUserShop = () => {
    return useQuery({
      queryKey: ['user-shop', user?.id],
      queryFn: async () => {
        if (!user?.id) return null;
        return shopService.getShopByUserId(user.id);
      },
      enabled: !!user?.id
    });
  };
  
  // Get shops by status
  const useShopsByStatus = (status: ShopStatus) => {
    return useQuery({
      queryKey: ['shops', status],
      queryFn: async () => {
        return shopService.getShopsByStatus(status);
      }
    });
  };
  
  // Create a new shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Omit<Shop, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'average_rating'>) => {
        if (!user?.id) throw new Error('User not authenticated');
        return shopService.createShop({
          ...shopData,
          user_id: user.id,
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
        return shopService.updateShop(id, data);
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
        return shopService.addShopItems(shopId, items);
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
        return shopService.updateShopItem(itemId, data);
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
        return shopService.updateShopItemStatus(itemId, status);
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
        return shopService.getShopItems(shopId);
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
        return shopService.getShopItemById(itemId);
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
        return shopService.getShopOrders(shopId);
      },
      enabled: !!shopId
    });
  };
  
  // Update order status
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
        return shopService.updateOrderStatus(orderId, status);
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
        return shopService.getShopReviews(shopId);
      },
      enabled: !!shopId
    });
  };
  
  // Check if a shop is favorited
  const useIsShopFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-favorited', shopId, user?.id],
      queryFn: async () => {
        if (!shopId || !user?.id) return false;
        return shopService.isShopFavorited(user.id, shopId);
      },
      enabled: !!shopId && !!user?.id
    });
  };
  
  // Get favorite shops
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favorite-shops', user?.id],
      queryFn: async () => {
        if (!user?.id) return [];
        return shopService.getFavoriteShops(user.id);
      },
      enabled: !!user?.id
    });
  };

  // Create a shop item
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: async ({ shopId, item }: { shopId: string; item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'> }) => {
        return shopService.addShopItems(shopId, [item]);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop-items', variables.shopId] });
      }
    });
  };

  // Add a shop to favorites
  const useFavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('User not authenticated');
        return shopService.addShopToFavorites(user.id, shopId);
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
        if (!user?.id) throw new Error('User not authenticated');
        return shopService.removeShopFromFavorites(user.id, shopId);
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
