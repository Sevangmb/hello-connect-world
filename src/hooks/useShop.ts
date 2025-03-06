
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, ShopReview, Order, CartItem, DbCartItem, ShopSettings, OrderStatus, PaymentStatus } from '@/core/shop/domain/types';
import { useState } from 'react';
import { useToast } from './use-toast';

/**
 * Custom hook for shop functionality
 */
export const useShop = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Get user's shop
   */
  const useUserShop = (userId?: string) => {
    const [userShop, setUserShop] = useState<Shop | null>(null);

    const query = useQuery({
      queryKey: ['user-shop', userId],
      queryFn: async () => {
        if (!userId) return null;
        const shopData = await shopService.getShopByUserId(userId);
        setUserShop(shopData);
        return shopData;
      },
      enabled: !!userId,
    });

    return {
      ...query,
      getUserShop: async (userId: string) => shopService.getShopByUserId(userId)
    };
  };

  /**
   * Create a shop
   */
  const useCreateShop = () => {
    const [creating, setCreating] = useState(false);

    const mutation = useMutation({
      mutationFn: async (shopData: Partial<Shop>) => {
        setCreating(true);
        try {
          const result = await shopService.createShop(shopData);
          return result;
        } finally {
          setCreating(false);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
        toast({
          title: 'Boutique créée',
          description: 'Votre boutique a été créée avec succès.',
        });
      },
      onError: (error) => {
        console.error('Error creating shop:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la création de votre boutique.',
          variant: 'destructive',
        });
      },
    });

    return {
      ...mutation,
      creating,
      execute: mutation.mutate
    };
  };

  /**
   * Update a shop
   */
  const useUpdateShop = () => {
    const mutation = useMutation({
      mutationFn: async ({ id, shopData }: { id: string; shopData: Partial<Shop> }) => {
        return await shopService.updateShop(id, shopData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
        toast({
          title: 'Boutique mise à jour',
          description: 'Votre boutique a été mise à jour avec succès.',
        });
      },
      onError: (error) => {
        console.error('Error updating shop:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la mise à jour de votre boutique.',
          variant: 'destructive',
        });
      },
    });

    return mutation;
  };

  /**
   * Create a shop item
   */
  const useCreateShopItem = () => {
    const [creating, setCreating] = useState(false);

    const mutation = useMutation({
      mutationFn: async (itemData: Partial<ShopItem>) => {
        setCreating(true);
        try {
          const result = await shopService.createShopItem(itemData);
          return result;
        } finally {
          setCreating(false);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shop-items'] });
        toast({
          title: 'Article ajouté',
          description: 'Votre article a été ajouté avec succès.',
        });
      },
      onError: (error) => {
        console.error('Error creating shop item:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de l\'ajout de votre article.',
          variant: 'destructive',
        });
      },
    });

    return {
      ...mutation,
      creating,
      execute: mutation.mutate
    };
  };

  /**
   * Delete a shop item
   */
  const useDeleteShopItem = () => {
    const mutation = useMutation({
      mutationFn: async (id: string) => {
        return await shopService.deleteShopItem(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shop-items'] });
        toast({
          title: 'Article supprimé',
          description: 'L\'article a été supprimé avec succès.',
        });
      },
      onError: (error) => {
        console.error('Error deleting shop item:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression de l\'article.',
          variant: 'destructive',
        });
      },
    });

    return mutation;
  };

  /**
   * Fetch shop items
   */
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-items', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return await shopService.getShopItems(shopId);
      },
      enabled: !!shopId,
    });
  };

  /**
   * Fetch shop orders
   */
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-orders', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return await shopService.getOrdersByShopId(shopId);
      },
      enabled: !!shopId,
    });
  };

  /**
   * Update order status
   */
  const useUpdateOrderStatus = () => {
    const mutation = useMutation({
      mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
        return await shopService.updateOrderStatus(orderId, status);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
        queryClient.invalidateQueries({ queryKey: ['user-orders'] });
        toast({
          title: 'Statut mis à jour',
          description: 'Le statut de la commande a été mis à jour avec succès.',
        });
      },
      onError: (error) => {
        console.error('Error updating order status:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la mise à jour du statut.',
          variant: 'destructive',
        });
      },
    });

    return mutation;
  };

  /**
   * Add to cart
   */
  const useAddToCart = () => {
    const mutation = useMutation({
      mutationFn: async (cartItem: DbCartItem) => {
        return await shopService.addToCart(cartItem);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart-items'] });
        toast({
          title: 'Article ajouté',
          description: 'L\'article a été ajouté à votre panier.',
        });
      },
      onError: (error) => {
        console.error('Error adding to cart:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de l\'ajout au panier.',
          variant: 'destructive',
        });
      },
    });

    return mutation;
  };

  return {
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useCreateShopItem,
    useDeleteShopItem,
    useShopItems,
    useShopOrders,
    useUpdateOrderStatus,
    useAddToCart,
  };
};
