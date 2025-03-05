
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, ShopReview, Order, OrderStatus } from '@/core/shop/domain/types';
import { toast } from 'sonner';

export const useShop = (userId?: string) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const shopService = getShopService();
  const queryClient = useQueryClient();

  // Fetch user's shop
  const { 
    data: shopData, 
    isLoading: isShopLoading, 
    error: shopError,
    refetch: refetchShop
  } = useQuery({
    queryKey: ['shop', userId],
    queryFn: async () => {
      if (!userId) return null;
      return await shopService.getShopByUserId(userId);
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (shopData) {
      setShop(shopData);
    }
  }, [shopData]);

  // Create shop mutation
  const createShop = useMutation({
    mutationFn: async (shopData: Partial<Shop>) => {
      if (!userId) throw new Error('User ID is required to create a shop');
      const data = {
        ...shopData,
        user_id: userId,
        status: 'pending'
      };
      return await shopService.createShop(data as Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>);
    },
    onSuccess: () => {
      toast.success('Shop created successfully');
      queryClient.invalidateQueries({ queryKey: ['shop', userId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create shop: ${error.message}`);
    }
  });

  // Update shop mutation
  const updateShop = useMutation({
    mutationFn: async (shopData: Partial<Shop> & { id: string }) => {
      return await shopService.updateShop(shopData);
    },
    onSuccess: () => {
      toast.success('Shop updated successfully');
      queryClient.invalidateQueries({ queryKey: ['shop', userId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update shop: ${error.message}`);
    }
  });

  // Get shop items
  const getShopItems = async (shopId: string): Promise<ShopItem[]> => {
    try {
      return await shopService.getShopItems(shopId);
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  };

  // Create shop item mutation
  const createShopItem = useMutation({
    mutationFn: async (itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>) => {
      return await shopService.createShopItem(itemData);
    },
    onSuccess: () => {
      toast.success('Item added successfully');
      if (shop) {
        queryClient.invalidateQueries({ queryKey: ['shop-items', shop.id] });
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to add item: ${error.message}`);
    }
  });

  // Update shop item mutation
  const updateShopItem = useMutation({
    mutationFn: async (itemData: Partial<ShopItem> & { id: string }) => {
      return await shopService.updateShopItem(itemData);
    },
    onSuccess: () => {
      toast.success('Item updated successfully');
      if (shop) {
        queryClient.invalidateQueries({ queryKey: ['shop-items', shop.id] });
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to update item: ${error.message}`);
    }
  });

  // Delete shop item mutation
  const deleteShopItem = useMutation({
    mutationFn: async (itemId: string) => {
      return await shopService.deleteShopItem(itemId);
    },
    onSuccess: () => {
      toast.success('Item deleted successfully');
      if (shop) {
        queryClient.invalidateQueries({ queryKey: ['shop-items', shop.id] });
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete item: ${error.message}`);
    }
  });

  // Get shop by ID
  const getShopById = async (id: string): Promise<Shop | null> => {
    try {
      return await shopService.getShopById(id);
    } catch (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }
  };

  // Get shop reviews
  const getShopReviews = async (shopId: string): Promise<ShopReview[]> => {
    try {
      return await shopService.getShopReviews(shopId);
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  };

  // Create shop review mutation
  const createShopReview = useMutation({
    mutationFn: async (reviewData: { shop_id: string; user_id: string; rating: number; comment?: string }) => {
      return await shopService.createShopReview(reviewData);
    },
    onSuccess: () => {
      toast.success('Review submitted successfully');
      if (shop) {
        queryClient.invalidateQueries({ queryKey: ['shop-reviews', shop.id] });
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit review: ${error.message}`);
    }
  });

  // Get shop orders
  const getShopOrders = async (shopId: string): Promise<Order[]> => {
    try {
      return await shopService.getShopOrders(shopId);
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  };

  // Update order status mutation
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      return await shopService.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      toast.success('Order status updated successfully');
      if (shop) {
        queryClient.invalidateQueries({ queryKey: ['shop-orders', shop.id] });
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to update order status: ${error.message}`);
    }
  });

  return {
    shop,
    isShopLoading,
    shopError,
    refetchShop,
    createShop,
    updateShop,
    getShopItems,
    createShopItem,
    updateShopItem,
    deleteShopItem,
    getShopById,
    getShopReviews,
    createShopReview,
    getShopOrders,
    updateOrderStatus
  };
};
