
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shop, ShopItem, ShopStatus, ShopItemStatus } from '@/core/shop/domain/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useShop = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get shop by ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        const { data, error } = await supabase
          .from('shops')
          .select('*, profiles(username, full_name), shop_settings(*)')
          .eq('id', shopId)
          .single();

        if (error) throw error;
        return data as Shop;
      },
      enabled: !!shopId
    });
  };

  // Get user's shop
  const useUserShop = () => {
    return useQuery({
      queryKey: ['user-shop', user?.id],
      queryFn: async () => {
        if (!user?.id) return null;
        const { data, error } = await supabase
          .from('shops')
          .select('*, profiles(username, full_name), shop_settings(*)')
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
  };

  // Create shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Partial<Shop>) => {
        const { data, error } = await supabase
          .from('shops')
          .insert({
            ...shopData,
            user_id: user?.id,
            status: 'pending' as ShopStatus,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data as Shop;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
      }
    });
  };

  // Update shop
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ id, shopData }: { id: string; shopData: Partial<Shop> }) => {
        const { data, error } = await supabase
          .from('shops')
          .update({
            ...shopData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as Shop;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['shop', data.id] });
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
      }
    });
  };

  // Get shop items
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop-items', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        const { data, error } = await supabase
          .from('shop_items')
          .select('*')
          .eq('shop_id', shopId)
          .eq('status', 'available' as ShopItemStatus)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ShopItem[];
      },
      enabled: !!shopId
    });
  };

  // Create shop item
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: async (itemData: Partial<ShopItem>) => {
        const { data, error } = await supabase
          .from('shop_items')
          .insert({
            ...itemData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data as ShopItem;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['shop-items', data.shop_id] });
      }
    });
  };

  // Update shop item
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ id, itemData }: { id: string; itemData: Partial<ShopItem> }) => {
        const { data, error } = await supabase
          .from('shop_items')
          .update({
            ...itemData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as ShopItem;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['shop-items', data.shop_id] });
      }
    });
  };

  // Delete shop item
  const useDeleteShopItem = () => {
    return useMutation({
      mutationFn: async ({ id, shopId }: { id: string; shopId: string }) => {
        const { error } = await supabase
          .from('shop_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { id, shopId };
      },
      onSuccess: ({ shopId }) => {
        queryClient.invalidateQueries({ queryKey: ['shop-items', shopId] });
      }
    });
  };

  // Add to favorites
  const useAddToFavorites = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('User not authenticated');
        
        const { error } = await supabase
          .from('user_favorite_shops')
          .insert({
            user_id: user.id,
            shop_id: shopId,
            created_at: new Date().toISOString()
          });
          
        if (error) throw error;
        return shopId;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorite-shops'] });
        queryClient.invalidateQueries({ queryKey: ['is-favorited'] });
      }
    });
  };

  // Remove from favorites
  const useRemoveFromFavorites = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('User not authenticated');
        
        const { error } = await supabase
          .from('user_favorite_shops')
          .delete()
          .eq('user_id', user.id)
          .eq('shop_id', shopId);
          
        if (error) throw error;
        return shopId;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorite-shops'] });
        queryClient.invalidateQueries({ queryKey: ['is-favorited'] });
      }
    });
  };

  // Check if shop is favorited
  const useIsShopFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['is-favorited', shopId, user?.id],
      queryFn: async () => {
        if (!user?.id || !shopId) return false;
        
        const { data, error } = await supabase
          .from('user_favorite_shops')
          .select('*')
          .eq('user_id', user.id)
          .eq('shop_id', shopId)
          .maybeSingle();
          
        if (error) throw error;
        return !!data;
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
        
        const { data: favoriteIds, error: favoriteError } = await supabase
          .from('user_favorite_shops')
          .select('shop_id')
          .eq('user_id', user.id);
          
        if (favoriteError) throw favoriteError;
        
        if (favoriteIds.length === 0) return [];
        
        const shopIds = favoriteIds.map(item => item.shop_id);
        
        const { data: shops, error: shopsError } = await supabase
          .from('shops')
          .select('*, profiles(username, full_name)')
          .in('id', shopIds);
          
        if (shopsError) throw shopsError;
        
        return shops as Shop[];
      },
      enabled: !!user?.id
    });
  };

  // Update shop settings
  const useUpdateShopSettings = () => {
    return useMutation({
      mutationFn: async ({ shopId, settingsData }: { shopId: string; settingsData: any }) => {
        // Check if settings exist first
        const { data: existingSettings, error: checkError } = await supabase
          .from('shop_settings')
          .select('*')
          .eq('shop_id', shopId)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        if (existingSettings) {
          // Update existing settings
          const { data, error } = await supabase
            .from('shop_settings')
            .update({
              ...settingsData,
              updated_at: new Date().toISOString()
            })
            .eq('shop_id', shopId)
            .select()
            .single();
            
          if (error) throw error;
          return data;
        } else {
          // Create new settings
          const { data, error } = await supabase
            .from('shop_settings')
            .insert({
              shop_id: shopId,
              delivery_options: settingsData.delivery_options || ['pickup'],
              payment_methods: settingsData.payment_methods || ['card'],
              auto_accept_orders: settingsData.auto_accept_orders !== undefined ? settingsData.auto_accept_orders : true,
              notification_preferences: settingsData.notification_preferences || { email: true, app: true },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (error) throw error;
          return data;
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
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
    useDeleteShopItem,
    useAddToFavorites,
    useRemoveFromFavorites,
    useIsShopFavorited,
    useFavoriteShops,
    useUpdateShopSettings
  };
};
