
import { useMutation, useQuery } from '@tanstack/react-query';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, Order } from '@/core/shop/domain/types';

export function useShop() {
  /**
   * Get shop for the current user
   */
  const useUserShop = () => {
    const getUserShop = async (userId: string) => {
      return shopService.getShopByUserId(userId);
    };

    return {
      getUserShop,
    };
  };

  /**
   * Create a new shop
   */
  const useCreateShop = () => {
    const mutation = useMutation({
      mutationFn: (shopData: Partial<Shop>) => shopService.createShop(shopData),
    });

    return {
      ...mutation,
      creating: mutation.isPending,
      mutate: (shopData: Partial<Shop>) => mutation.mutate(shopData),
      execute: (shopData: Partial<Shop>) => mutation.mutateAsync(shopData),
    };
  };

  /**
   * Update an existing shop
   */
  const useUpdateShop = () => {
    const mutation = useMutation({
      mutationFn: ({ 
        shopId, shopData 
      }: { 
        shopId: string, 
        shopData: Partial<Shop> 
      }) => shopService.updateShop(shopId, shopData),
    });

    return {
      ...mutation,
      updating: mutation.isPending,
    };
  };

  /**
   * Get all shop items
   */
  const useShopItems = (shopId: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: () => shopService.getShopItems(shopId),
      enabled: !!shopId,
    });
  };

  /**
   * Create a new shop item
   */
  const useCreateShopItem = () => {
    const mutation = useMutation({
      mutationFn: (itemData: Partial<ShopItem>) => shopService.createShopItem(itemData),
    });

    return {
      ...mutation,
      creating: mutation.isPending,
      mutate: (itemData: Partial<ShopItem>) => mutation.mutate(itemData),
      execute: (itemData: Partial<ShopItem>) => mutation.mutateAsync(itemData),
    };
  };

  /**
   * Update a shop item
   */
  const useUpdateShopItem = () => {
    const mutation = useMutation({
      mutationFn: ({ 
        itemId, itemData 
      }: { 
        itemId: string, 
        itemData: Partial<ShopItem> 
      }) => shopService.updateShopItem(itemId, itemData),
    });

    return {
      ...mutation,
      updating: mutation.isPending,
    };
  };

  /**
   * Delete a shop item
   */
  const useDeleteShopItem = () => {
    const mutation = useMutation({
      mutationFn: (itemId: string) => {
        // Return a resolved promise for now since this function isn't implemented
        return Promise.resolve(true);
      },
    });

    return {
      ...mutation,
      deleting: mutation.isPending,
    };
  };

  /**
   * Get shop by ID
   */
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: () => shopService.getShopById(shopId || ''),
      enabled: !!shopId,
    });
  };

  /**
   * Get shop orders
   */
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopOrders', shopId],
      queryFn: () => shopService.getShopOrders(shopId || ''),
      enabled: !!shopId,
    });
  };

  /**
   * Update order status
   */
  const useUpdateOrderStatus = () => {
    const mutation = useMutation({
      mutationFn: ({ 
        orderId, status 
      }: { 
        orderId: string, 
        status: string 
      }) => shopService.updateOrderStatus(orderId, status),
    });

    return {
      ...mutation,
      updating: mutation.isPending,
    };
  };

  /**
   * Add item to cart
   */
  const useAddToCart = () => {
    const mutation = useMutation({
      mutationFn: ({ 
        userId, itemId, quantity = 1 
      }: { 
        userId: string, 
        itemId: string, 
        quantity?: number 
      }) => shopService.addToCart(userId, itemId, quantity),
    });

    return {
      ...mutation,
      adding: mutation.isPending,
    };
  };

  return {
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useShopItems,
    useCreateShopItem,
    useUpdateShopItem,
    useDeleteShopItem,
    useShopById,
    useShopOrders,
    useUpdateOrderStatus,
    useAddToCart,
  };
}
