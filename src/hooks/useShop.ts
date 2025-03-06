
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, Order, OrderStatus } from '@/core/shop/domain/types';

const shopService = getShopService();

export const useShop = () => {
  const queryClient = useQueryClient();

  // Shop queries
  const useShopById = (shopId?: string) => 
    useQuery({
      queryKey: ['shops', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        return shopService.getShopById(shopId);
      },
      enabled: !!shopId
    });
  
  const useUserShop = () => 
    useQuery({
      queryKey: ['user-shop'],
      queryFn: async () => {
        // Get current user ID
        const user = await shopService.getCurrentUser();
        if (!user) return null;
        
        return shopService.getShopByUserId(user.id);
      }
    });
  
  const useAllShops = () => 
    useQuery({
      queryKey: ['shops'],
      queryFn: () => shopService.getShops()
    });
  
  const useShopsByStatus = (status: string) => 
    useQuery({
      queryKey: ['shops', 'status', status],
      queryFn: () => shopService.getShopsByStatus(status),
      enabled: !!status
    });
  
  // Shop mutations
  const useCreateShop = () => 
    useMutation({
      mutationFn: (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>) => 
        shopService.createShop(shopData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shops'] });
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
      }
    });
  
  const useUpdateShop = () => 
    useMutation({
      mutationFn: ({ id, data }: { id: string, data: Partial<Shop> }) => 
        shopService.updateShop(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shops', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
      }
    });
  
  // Shop items
  const useShopItems = (shopId?: string) => 
    useQuery({
      queryKey: ['shop-items', shopId],
      queryFn: () => shopService.getShopItems(shopId as string),
      enabled: !!shopId
    });
  
  const useShopItemById = (itemId?: string) => 
    useQuery({
      queryKey: ['shop-items', 'single', itemId],
      queryFn: () => shopService.getShopItemById(itemId as string),
      enabled: !!itemId
    });
  
  const useCreateShopItem = () => 
    useMutation({
      mutationFn: (itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>) => 
        shopService.createShopItem(itemData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop-items', variables.shop_id] });
      }
    });
  
  const useUpdateShopItem = () => 
    useMutation({
      mutationFn: ({ id, data }: { id: string, data: Partial<ShopItem> }) => 
        shopService.updateShopItem(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop-items', 'single', variables.id] });
        // We don't know the shop ID here, so invalidate all items
        queryClient.invalidateQueries({ queryKey: ['shop-items'] });
      }
    });
  
  // Orders
  const useShopOrders = (shopId?: string) => 
    useQuery({
      queryKey: ['shop-orders', shopId],
      queryFn: () => shopService.getOrdersByShop(shopId as string),
      enabled: !!shopId
    });
  
  const useCustomerOrders = (customerId?: string) => 
    useQuery({
      queryKey: ['customer-orders', customerId],
      queryFn: () => shopService.getOrdersByCustomer(customerId as string),
      enabled: !!customerId
    });
  
  const useOrderById = (orderId?: string) => 
    useQuery({
      queryKey: ['orders', orderId],
      queryFn: () => shopService.getOrderById(orderId as string),
      enabled: !!orderId
    });
  
  const useUpdateOrderStatus = () => 
    useMutation({
      mutationFn: ({ orderId, status }: { orderId: string, status: string }) => 
        shopService.updateOrderStatus(orderId, status as OrderStatus),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
        queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
        queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
      }
    });
  
  // Favorites
  const useFavoriteShops = () => 
    useQuery({
      queryKey: ['favorite-shops'],
      queryFn: () => shopService.getFavoriteShops()
    });

  // For the favorite/unfavorite operations based on the error in ShopDetail.tsx
  const useFavoriteShop = () => 
    useMutation({
      mutationFn: (shopId: string) => shopService.addShopToFavorites(shopId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorite-shops'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      }
    });

  const useUnfavoriteShop = () => 
    useMutation({
      mutationFn: (shopId: string) => shopService.removeShopFromFavorites(shopId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorite-shops'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      }
    });
  
  return {
    // Shop queries
    useShopById,
    useUserShop,
    useAllShops,
    useShopsByStatus,
    
    // Shop mutations
    useCreateShop,
    useUpdateShop,
    
    // Shop items
    useShopItems,
    useShopItemById,
    useCreateShopItem,
    useUpdateShopItem,
    
    // Orders
    useShopOrders,
    useCustomerOrders,
    useOrderById,
    useUpdateOrderStatus,
    
    // Favorites
    useFavoriteShops,
    useFavoriteShop,
    useUnfavoriteShop
  };
};
