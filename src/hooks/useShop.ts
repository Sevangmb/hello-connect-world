
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { Shop, ShopItem, ShopStatus, Order, ShopSettings, ShopReview } from '@/core/shop/domain/types';

export const useShop = (shopId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isShopOwner, setIsShopOwner] = useState(false);

  // Get shop by ID
  const {
    data: shop,
    isLoading: isShopLoading,
    refetch: refetchShop,
    error: shopError
  } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: async () => {
      if (!shopId) return null;
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles:user_id(username, full_name)')
        .eq('id', shopId)
        .single();

      if (error) throw error;
      return data as Shop;
    },
    enabled: !!shopId
  });

  // Check if current user is the shop owner
  const isCurrentUserShopOwner = user?.id === shop?.user_id;

  // Get user's shop
  const {
    data: userShop,
    isLoading: isUserShopLoading,
    refetch: refetchUserShop
  } = useQuery({
    queryKey: ['userShop', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No shop found
        throw error;
      }
      return data as Shop;
    },
    enabled: !!user?.id
  });

  // Create shop mutation
  const createShop = useMutation({
    mutationFn: async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>) => {
      const { data, error } = await supabase
        .from('shops')
        .insert(shopData)
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userShop', user?.id] });
      toast({
        title: 'Boutique créée',
        description: 'Votre boutique a été créée avec succès',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Impossible de créer la boutique: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Update shop info
  const updateShopInfo = useMutation({
    mutationFn: async ({ id, ...shopData }: Partial<Shop> & { id: string }) => {
      const { data, error } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shop', data.id] });
      queryClient.invalidateQueries({ queryKey: ['userShop', user?.id] });
      toast({
        title: 'Boutique mise à jour',
        description: 'Les informations de votre boutique ont été mises à jour',
        variant: 'default',
      });
    }
  });

  // Update shop status
  const updateShopStatus = useMutation({
    mutationFn: async ({ shopId, status }: { shopId: string; status: ShopStatus }) => {
      const { data, error } = await supabase
        .from('shops')
        .update({ status })
        .eq('id', shopId)
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shop', data.id] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      toast({
        title: 'Statut mis à jour',
        description: `Le statut de la boutique a été changé à ${data.status}`,
        variant: 'default',
      });
    }
  });

  // Get shop items
  const getShopItems = useCallback(async (shopId: string) => {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, clothes(name, description, image_url)')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data as ShopItem[];
  }, []);

  // Create shop item
  const createShopItem = useMutation({
    mutationFn: async (itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('shop_items')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shopItems', data.shop_id] });
      toast({
        title: 'Article ajouté',
        description: 'L\'article a été ajouté à votre boutique',
        variant: 'default',
      });
    }
  });

  // Update shop item status
  const updateShopItemStatus = useMutation({
    mutationFn: async ({ itemId, status }: { itemId: string; status: ShopItem['status'] }) => {
      const { data, error } = await supabase
        .from('shop_items')
        .update({ status })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shopItems', data.shop_id] });
    }
  });

  // Remove shop item
  const removeShopItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      toast({
        title: 'Article supprimé',
        description: 'L\'article a été supprimé de votre boutique',
        variant: 'default',
      });
    }
  });

  // Get shop reviews
  const getShopReviews = useCallback(async (shopId: string) => {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*, profiles:user_id(username, full_name)')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data as ShopReview[];
  }, []);

  // Get shop orders
  const getShopOrders = useCallback(async (shopId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('seller_id', shopId);

    if (error) throw error;
    return data as Order[];
  }, []);

  // Update order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
      toast({
        title: 'Commande mise à jour',
        description: 'Le statut de la commande a été mis à jour',
        variant: 'default',
      });
    }
  });

  // Get shop settings
  const getShopSettings = useCallback(async (shopId: string) => {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('shop_id', shopId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No settings found
      throw error;
    }
    return data as ShopSettings;
  }, []);

  // Update shop settings
  const updateShopSettings = useMutation({
    mutationFn: async (settings: Partial<ShopSettings> & { id: string }) => {
      const { data, error } = await supabase
        .from('shop_settings')
        .update(settings)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      return data as ShopSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopSettings'] });
      toast({
        title: 'Paramètres mis à jour',
        description: 'Les paramètres de votre boutique ont été mis à jour',
        variant: 'default',
      });
    }
  });

  // Update shop owner status when shop data changes
  useEffect(() => {
    if (shop && user) {
      setIsShopOwner(shop.user_id === user.id);
    }
  }, [shop, user]);

  return {
    shop,
    isShopLoading,
    refetchShop,
    shopError,
    isCurrentUserShopOwner,
    userShop,
    isUserShopLoading,
    refetchUserShop,
    createShop,
    updateShopInfo,
    updateShopStatus,
    getShopItems,
    createShopItem,
    updateShopItemStatus,
    removeShopItem,
    getShopReviews,
    getShopOrders,
    updateOrderStatus,
    getShopSettings,
    updateShopSettings
  };
};
