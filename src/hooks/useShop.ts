
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, ShopStatus, ShopSettings, Order, OrderStatus, PaymentStatus } from '@/core/shop/domain/types';
import { toast } from 'sonner';
import { useState } from 'react';

export const useShop = () => {
  const queryClient = useQueryClient();
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Fetch shop by user ID
   */
  const fetchShopByUserId = async () => {
    try {
      setLoading(true);
      const fetchedShop = await shopService.getUserShop();
      if (fetchedShop) {
        setShop(fetchedShop);
        return fetchedShop;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user shop:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch shop items
   */
  const fetchShopItems = async (shopId: string) => {
    try {
      setLoading(true);
      const items = await shopService.getShopItems(shopId);
      setShopItems(items);
      return items;
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a shop
   */
  const useCreateShop = () => {
    return useMutation({
      mutationFn: (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>) => {
        return shopService.createShop(shopData);
      },
      onSuccess: () => {
        toast.success('Boutique créée avec succès');
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
      },
      onError: (error) => {
        console.error('Error creating shop:', error);
        toast.error('Erreur lors de la création de la boutique');
      }
    });
  };

  /**
   * Update a shop
   */
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: ({ shopId, shopData }: { shopId: string; shopData: Partial<Shop> }) => {
        return shopService.updateShop(shopId, shopData);
      },
      onSuccess: () => {
        toast.success('Boutique mise à jour avec succès');
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
      },
      onError: (error) => {
        console.error('Error updating shop:', error);
        toast.error('Erreur lors de la mise à jour de la boutique');
      }
    });
  };

  /**
   * Create a shop item
   */
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: (itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>) => {
        return shopService.createShopItem(itemData);
      },
      onSuccess: () => {
        toast.success('Article ajouté avec succès');
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      },
      onError: (error) => {
        console.error('Error creating shop item:', error);
        toast.error('Erreur lors de l\'ajout de l\'article');
      }
    });
  };

  /**
   * Update a shop item
   */
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: ({ itemId, itemData }: { itemId: string; itemData: Partial<ShopItem> }) => {
        return shopService.updateShopItem(itemId, itemData);
      },
      onSuccess: () => {
        toast.success('Article mis à jour avec succès');
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      },
      onError: (error) => {
        console.error('Error updating shop item:', error);
        toast.error('Erreur lors de la mise à jour de l\'article');
      }
    });
  };

  /**
   * Delete a shop item
   */
  const useDeleteShopItem = () => {
    return useMutation({
      mutationFn: (itemId: string) => {
        return shopService.deleteShopItem(itemId);
      },
      onSuccess: () => {
        toast.success('Article supprimé avec succès');
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      },
      onError: (error) => {
        console.error('Error deleting shop item:', error);
        toast.error('Erreur lors de la suppression de l\'article');
      }
    });
  };

  /**
   * Use shop by ID
   */
  const useShopById = (shopId: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: () => shopService.getShopById(shopId),
      enabled: !!shopId
    });
  };

  /**
   * Use shop items
   */
  const useShopItems = (shopId: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: () => shopService.getShopItems(shopId),
      enabled: !!shopId
    });
  };

  /**
   * Use shop settings
   */
  const useShopSettings = (shopId: string) => {
    return useQuery({
      queryKey: ['shopSettings', shopId],
      queryFn: () => shopService.getShopSettings(shopId),
      enabled: !!shopId
    });
  };

  /**
   * Use update shop settings
   */
  const useUpdateShopSettings = () => {
    return useMutation({
      mutationFn: ({ shopId, settings }: { shopId: string; settings: Partial<ShopSettings> }) => {
        return shopService.updateShopSettings(shopId, settings);
      },
      onSuccess: () => {
        toast.success('Paramètres mis à jour avec succès');
        queryClient.invalidateQueries({ queryKey: ['shopSettings'] });
      },
      onError: (error) => {
        console.error('Error updating shop settings:', error);
        toast.error('Erreur lors de la mise à jour des paramètres');
      }
    });
  };

  /**
   * Use shop orders
   */
  const useShopOrders = (shopId: string) => {
    return useQuery({
      queryKey: ['shopOrders', shopId],
      queryFn: () => shopService.getOrdersByShopId(shopId),
      enabled: !!shopId
    });
  };

  /**
   * Use update order status
   */
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
        return shopService.updateOrderStatus(orderId, status);
      },
      onSuccess: () => {
        toast.success('Statut de la commande mis à jour');
        queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
      },
      onError: (error) => {
        console.error('Error updating order status:', error);
        toast.error('Erreur lors de la mise à jour du statut');
      }
    });
  };

  /**
   * Use is shop favorited
   */
  const useIsShopFavorited = (shopId: string) => {
    return useQuery({
      queryKey: ['shopFavorite', shopId],
      queryFn: () => shopService.isShopFavorited(shopId),
      enabled: !!shopId
    });
  };

  return {
    shop,
    shopItems,
    loading,
    fetchShopByUserId,
    fetchShopItems,
    useCreateShop,
    useUpdateShop,
    useCreateShopItem,
    useUpdateShopItem,
    useDeleteShopItem,
    useShopById,
    useShopItems,
    useShopSettings,
    useUpdateShopSettings,
    useShopOrders,
    useUpdateOrderStatus,
    useIsShopFavorited,
    shopService
  };
};
