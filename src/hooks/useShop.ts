import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';

export const useShop = () => {
  const shopService = getShopService();
  const queryClient = useQueryClient();

  // Get shop by ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        return await shopService.getShopById(shopId);
      },
      enabled: !!shopId
    });
  };

  // Get shop by user ID (current user's shop)
  const useUserShop = () => {
    return useQuery({
      queryKey: ['user', 'shop'],
      queryFn: async () => {
        return await shopService.getUserShop();
      }
    });
  };

  // Create a new shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: any) => {
        return await shopService.createShop(shopData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user', 'shop'] });
      }
    });
  };

  // Update shop
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ shopId, data }: { shopId: string; data: any }) => {
        return await shopService.updateShop(shopId, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
        queryClient.invalidateQueries({ queryKey: ['user', 'shop'] });
      }
    });
  };

  // Get shop items
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', 'items', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        return await shopService.getShopItems(shopId);
      },
      enabled: !!shopId
    });
  };

  // Create shop item
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: async (itemData: any) => {
        return await shopService.createShopItem(itemData);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', 'items', variables.shop_id] });
      }
    });
  };

  // Update shop item
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ itemId, data }: { itemId: string; data: any }) => {
        return await shopService.updateShopItem(itemId, data);
      },
      onSuccess: (_, variables) => {
        // We need to invalidate the shop items query, but we don't have the shop ID here
        // So we invalidate all shop items queries
        queryClient.invalidateQueries({ queryKey: ['shop', 'items'] });
      }
    });
  };

  // Get shop reviews
  const useShopReviews = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', 'reviews', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        return await shopService.getShopReviews(shopId);
      },
      enabled: !!shopId
    });
  };

  // Create shop review
  const useCreateShopReview = () => {
    return useMutation({
      mutationFn: async (reviewData: any) => {
        return await shopService.createShopReview(reviewData);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', 'reviews', variables.shop_id] });
        // Also invalidate the shop query to update the average rating
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shop_id] });
      }
    });
  };

  // Add missing methods for orders
  const useOrders = (shopId: string) => {
    return useQuery({
      queryKey: ['shop', 'orders', shopId],
      queryFn: async () => {
        try {
          // Implement getOrders in ShopService if needed
          return await shopService.getOrdersByShop(shopId);
        } catch (error) {
          console.error('Error fetching shop orders:', error);
          throw error;
        }
      },
      enabled: !!shopId
    });
  };

  const useCustomerOrders = (customerId: string) => {
    return useQuery({
      queryKey: ['customer', 'orders', customerId],
      queryFn: async () => {
        try {
          // Implement getOrdersByCustomer in ShopService if needed
          return await shopService.getOrdersByCustomer(customerId);
        } catch (error) {
          console.error('Error fetching customer orders:', error);
          throw error;
        }
      },
      enabled: !!customerId
    });
  };

  // Get order by ID
  const useOrderById = (orderId?: string) => {
    return useQuery({
      queryKey: ['order', orderId],
      queryFn: async () => {
        if (!orderId) throw new Error('Order ID is required');
        return await shopService.getOrderById(orderId);
      },
      enabled: !!orderId
    });
  };

  // Update order status
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
        return await shopService.updateOrderStatus(orderId, status);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
        // Also invalidate shop orders and customer orders
        queryClient.invalidateQueries({ queryKey: ['shop', 'orders'] });
        queryClient.invalidateQueries({ queryKey: ['customer', 'orders'] });
      }
    });
  };

  // Add missing methods for favorite shops
  const useIsFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', 'favorite', shopId],
      queryFn: async () => {
        if (!shopId) return false;
        try {
          // Implement isShopFavorited in ShopService if needed
          return await shopService.isShopFavorited(shopId);
        } catch (error) {
          console.error('Error checking if shop is favorited:', error);
          throw error;
        }
      },
      enabled: !!shopId
    });
  };

  const useFavoriteToggle = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        const isFavorited = await shopService.isShopFavorited(shopId);
        if (isFavorited) {
          // Implement removeShopFromFavorites in ShopService if needed
          return await shopService.removeShopFromFavorites(shopId);
        } else {
          // Implement addShopToFavorites in ShopService if needed
          return await shopService.addShopToFavorites(shopId);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shop', 'favorite'] });
        queryClient.invalidateQueries({ queryKey: ['favorite', 'shops'] });
      }
    });
  };

  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favorite', 'shops'],
      queryFn: async () => {
        try {
          // Implement getFavoriteShops in ShopService if needed
          return await shopService.getFavoriteShops();
        } catch (error) {
          console.error('Error fetching favorite shops:', error);
          throw error;
        }
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
    useShopReviews,
    useCreateShopReview,
    useOrderById,
    useUpdateOrderStatus,
    useOrders,
    useCustomerOrders,
    useIsFavorited,
    useFavoriteToggle,
    useFavoriteShops
  };
};
