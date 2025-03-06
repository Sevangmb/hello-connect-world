import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, OrderStatus } from '@/core/shop/domain/types';
import { toast } from 'sonner';

// Utility function to handle errors
const handleServiceError = (error: any, message: string) => {
  console.error(message, error);
  toast.error(message);
};

// Hook to fetch all shops
export const useShops = () => {
  return useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      try {
        return await shopService.getAllShops();
      } catch (error) {
        handleServiceError(error, 'Failed to fetch shops');
        return [];
      }
    },
  });
};

// Hook to fetch a shop by ID
export const useShop = (shopId?: string) => {
  return useQuery({
    queryKey: ['shop', shopId],
    queryFn: async () => {
      if (!shopId) return null;
      try {
        return await shopService.getShopById(shopId);
      } catch (error) {
        handleServiceError(error, `Failed to fetch shop with ID ${shopId}`);
        return null;
      }
    },
    enabled: !!shopId, // Only run the query if shopId is not undefined
  });
};

// Hook to fetch shop items
export const useShopItems = (shopId?: string) => {
  return useQuery({
    queryKey: ['shop-items', shopId],
    queryFn: async () => {
      if (!shopId) return [];
      try {
        return await shopService.getShopItems(shopId);
      } catch (error) {
        handleServiceError(error, `Failed to fetch shop items for shop ID ${shopId}`);
        return [];
      }
    },
    enabled: !!shopId, // Only run the query if shopId is not undefined
  });
};

// Hook to fetch all shop items
export const useAllShopItems = () => {
  return useQuery({
    queryKey: ['all-shop-items'],
    queryFn: async () => {
      try {
        return await shopService.getAllShopItems();
      } catch (error) {
        handleServiceError(error, 'Failed to fetch all shop items');
        return [];
      }
    },
  });
};

// Hook to create a shop item
export const useCreateShopItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Partial<ShopItem>) => {
      try {
        return await shopService.createShopItem(item);
      } catch (error) {
        handleServiceError(error, 'Failed to create shop item');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shop-items']);
      queryClient.invalidateQueries(['all-shop-items']);
      toast.success('Shop item created successfully!');
    },
    onError: (error: any) => {
      handleServiceError(error, 'Failed to create shop item');
    },
  });
};

// Hook to update a shop item
export const useUpdateShopItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, itemData }: { itemId: string; itemData: Partial<ShopItem> }) => {
      try {
        return await shopService.updateShopItem(itemId, itemData);
      } catch (error) {
        handleServiceError(error, `Failed to update shop item with ID ${itemId}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shop-items']);
      queryClient.invalidateQueries(['all-shop-items']);
      toast.success('Shop item updated successfully!');
    },
    onError: (error: any, variables) => {
      handleServiceError(error, `Failed to update shop item with ID ${variables.itemId}`);
    },
  });
};

// Hook to delete a shop item
export const useDeleteShopItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      try {
        return await shopService.deleteShopItem(itemId);
      } catch (error) {
        handleServiceError(error, `Failed to delete shop item with ID ${itemId}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shop-items']);
      queryClient.invalidateQueries(['all-shop-items']);
      toast.success('Shop item deleted successfully!');
    },
    onError: (error: any, itemId) => {
      handleServiceError(error, `Failed to delete shop item with ID ${itemId}`);
    },
  });
};

// Hook to create a shop
export const useCreateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shopData: Partial<Shop>) => {
      try {
        return await shopService.createShop(shopData);
      } catch (error) {
        handleServiceError(error, 'Failed to create shop');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shops']);
      toast.success('Shop created successfully!');
    },
    onError: (error: any) => {
      handleServiceError(error, 'Failed to create shop');
    },
  });
};

// Hook to update a shop
export const useUpdateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shopId, shopData }: { shopId: string; shopData: Partial<Shop> }) => {
      try {
        return await shopService.updateShop(shopId, shopData);
      } catch (error) {
        handleServiceError(error, `Failed to update shop with ID ${shopId}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shops']);
      toast.success('Shop updated successfully!');
    },
    onError: (error: any, variables) => {
      handleServiceError(error, `Failed to update shop with ID ${variables.shopId}`);
    },
  });
};

// Hook to fetch user orders
export const useUserOrders = (userId?: string, status?: OrderStatus) => {
  return useQuery({
    queryKey: ['user-orders', userId, status],
    queryFn: async () => {
      if (!userId) return [];
      // Use getOrdersByUserId instead of getUserOrders
      return await shopService.getOrdersByUserId(userId, status);
    },
    enabled: !!userId
  });
};

export default {
  useShops,
  useShop,
  useShopItems,
  useAllShopItems,
  useCreateShopItem,
  useUpdateShopItem,
  useDeleteShopItem,
  useCreateShop,
  useUpdateShop,
  useUserOrders,
};
