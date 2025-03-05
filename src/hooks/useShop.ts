
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  Order, 
  OrderStatus, 
  ShopSettings,
  ShopItemStatus 
} from '@/core/shop/domain/types';
import { useToast } from './use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useShop = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const shopService = getShopService();
  
  // Hook to get shop by ID
  const useShopById = (shopId?: string) => {
    const { id } = useParams<{ id: string }>();
    const finalId = shopId || id;
    
    return useQuery({
      queryKey: ['shop', finalId],
      queryFn: async () => {
        if (!finalId) throw new Error('Shop ID is required');
        return shopService.getShopById(finalId);
      },
      enabled: !!finalId
    });
  };
  
  // Hook to get the current user's shop
  const useUserShop = () => {
    return useQuery({
      queryKey: ['userShop', user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User must be logged in');
        return shopService.getShopByUserId(user.id);
      },
      enabled: !!user?.id
    });
  };
  
  // Hook to create a shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>) => {
        if (!user?.id) throw new Error('User must be logged in');
        return shopService.createShop(shopData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
        toast({
          title: 'Success',
          description: 'Shop created successfully'
        });
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to create shop: ${error.message}`
        });
      }
    });
  };
  
  // Hook to update a shop
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ shopId, data }: { shopId: string; data: Partial<Shop> }) => {
        return shopService.updateShop(shopId, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
        toast({
          title: 'Success',
          description: 'Shop updated successfully'
        });
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to update shop: ${error.message}`
        });
      }
    });
  };
  
  // Hook to get shop items
  const useShopItems = (shopId?: string) => {
    const { id } = useParams<{ id: string }>();
    const finalId = shopId || id;
    
    return useQuery({
      queryKey: ['shopItems', finalId],
      queryFn: async () => {
        if (!finalId) throw new Error('Shop ID is required');
        return shopService.getShopItems(finalId);
      },
      enabled: !!finalId
    });
  };
  
  // Hook to add a shop item
  const useAddShopItem = () => {
    return useMutation({
      mutationFn: async (itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>) => {
        return shopService.createShopItem(itemData);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', variables.shop_id] });
        toast({
          title: 'Success',
          description: 'Item added successfully'
        });
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to add item: ${error.message}`
        });
      }
    });
  };
  
  // Hook to update a shop item
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ itemId, data }: { itemId: string; data: Partial<ShopItem> }) => {
        return shopService.updateShopItem(itemId, data);
      },
      onSuccess: (item) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', item.shop_id] });
        toast({
          title: 'Success',
          description: 'Item updated successfully'
        });
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to update item: ${error.message}`
        });
      }
    });
  };
  
  // Hook to delete a shop item
  const useDeleteShopItem = () => {
    return useMutation({
      mutationFn: async ({ itemId, shopId }: { itemId: string; shopId: string }) => {
        return shopService.deleteShopItem(itemId);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', variables.shopId] });
        toast({
          title: 'Success',
          description: 'Item deleted successfully'
        });
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to delete item: ${error.message}`
        });
      }
    });
  };
  
  // Hook to get shop orders
  const useShopOrders = (shopId?: string) => {
    const { id } = useParams<{ id: string }>();
    const finalId = shopId || id;
    
    return useQuery({
      queryKey: ['shopOrders', finalId],
      queryFn: async () => {
        if (!finalId) throw new Error('Shop ID is required');
        return shopService.getOrders(finalId);
      },
      enabled: !!finalId
    });
  };
  
  // Hook to get user orders
  const useUserOrders = () => {
    return useQuery({
      queryKey: ['userOrders', user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User must be logged in');
        return shopService.getOrdersByCustomer(user.id);
      },
      enabled: !!user?.id
    });
  };
  
  // Hook to update order status
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
        return shopService.updateOrderStatus(orderId, status);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
        queryClient.invalidateQueries({ queryKey: ['userOrders'] });
        toast({
          title: 'Success',
          description: 'Order status updated successfully'
        });
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to update order status: ${error.message}`
        });
      }
    });
  };
  
  // Hook to get shop reviews
  const useShopReviews = (shopId?: string) => {
    const { id } = useParams<{ id: string }>();
    const finalId = shopId || id;
    
    return useQuery({
      queryKey: ['shopReviews', finalId],
      queryFn: async () => {
        if (!finalId) throw new Error('Shop ID is required');
        return shopService.getShopReviews(finalId);
      },
      enabled: !!finalId
    });
  };
  
  // Hook to add a shop review
  const useAddShopReview = () => {
    return useMutation({
      mutationFn: async (reviewData: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>) => {
        if (!user?.id) throw new Error('User must be logged in');
        return shopService.createShopReview(reviewData);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopReviews', variables.shop_id] });
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shop_id] });
        toast({
          title: 'Success',
          description: 'Review added successfully'
        });
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to add review: ${error.message}`
        });
      }
    });
  };
  
  // Hook to check if a shop is favorited
  const useIsFavorited = (shopId?: string) => {
    const { id } = useParams<{ id: string }>();
    const finalId = shopId || id;
    
    return useQuery({
      queryKey: ['shopFavorited', finalId, user?.id],
      queryFn: async () => {
        if (!finalId) throw new Error('Shop ID is required');
        if (!user?.id) return false;
        return shopService.isShopFavorited(user.id, finalId);
      },
      enabled: !!finalId && !!user?.id
    });
  };
  
  // Hook to toggle favorite status
  const useToggleFavorite = () => {
    return useMutation({
      mutationFn: async ({ shopId, isFavorited }: { shopId: string; isFavorited: boolean }) => {
        if (!user?.id) throw new Error('User must be logged in');
        
        if (isFavorited) {
          return shopService.removeShopFromFavorites(user.id, shopId);
        } else {
          return shopService.addShopToFavorites(user.id, shopId);
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopFavorited', variables.shopId] });
        queryClient.invalidateQueries({ queryKey: ['favoriteShops'] });
        toast({
          title: 'Success',
          description: variables.isFavorited 
            ? 'Shop removed from favorites' 
            : 'Shop added to favorites'
        });
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to update favorites: ${error.message}`
        });
      }
    });
  };
  
  // Hook to get favorite shops
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favoriteShops', user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User must be logged in');
        return shopService.getUserFavoriteShops(user.id);
      },
      enabled: !!user?.id
    });
  };

  // Return all the hooks
  return {
    useShopById,
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useShopItems,
    useAddShopItem,
    useUpdateShopItem,
    useDeleteShopItem,
    useShopOrders,
    useUserOrders,
    useUpdateOrderStatus,
    useShopReviews,
    useAddShopReview,
    useIsFavorited,
    useToggleFavorite,
    useFavoriteShops
  };
};
