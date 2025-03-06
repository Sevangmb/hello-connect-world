
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shop, ShopSettings, ShopItem, ShopReview, mapSettings } from '@/core/shop/domain/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useShop = () => {
  const queryClient = useQueryClient();
  
  // Shop Queries
  const getUserShop = (userId?: string) => {
    return useQuery({
      queryKey: ['userShop', userId],
      queryFn: async () => {
        if (!userId) return null;
        const { data, error } = await supabase
          .from('shops')
          .select('*, profiles(username, full_name)')
          .eq('user_id', userId)
          .single();
        
        if (error) throw error;
        return data as Shop;
      },
      enabled: !!userId
    });
  };
  
  const getShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        const { data, error } = await supabase
          .from('shops')
          .select('*, profiles(username, full_name)')
          .eq('id', shopId)
          .single();
        
        if (error) throw error;
        return data as Shop;
      },
      enabled: !!shopId
    });
  };
  
  // Shop Item Queries
  const getShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        const { data, error } = await supabase
          .from('shop_items')
          .select('*, shop:shops(name)')
          .eq('shop_id', shopId);
        
        if (error) throw error;
        return data as ShopItem[];
      },
      enabled: !!shopId
    });
  };
  
  // Shop Settings Queries
  const getShopSettings = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopSettings', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        const { data, error } = await supabase
          .from('shop_settings')
          .select('*')
          .eq('shop_id', shopId)
          .single();
        
        if (error) throw error;
        return mapSettings(data);
      },
      enabled: !!shopId
    });
  };
  
  // Shop Reviews Queries
  const getShopReviews = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopReviews', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        const { data, error } = await supabase
          .from('shop_reviews')
          .select('*, profiles:profiles(username, full_name)')
          .eq('shop_id', shopId);
        
        if (error) throw error;
        return data as ShopReview[];
      },
      enabled: !!shopId
    });
  };
  
  // Shop Mutations
  const createShop = useMutation({
    mutationFn: async (data: Partial<Shop>) => {
      const { data: shop, error } = await supabase
        .from('shops')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return shop as Shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userShop'] });
    }
  });
  
  const updateShop = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Shop> }) => {
      const { data: shop, error } = await supabase
        .from('shops')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return shop as Shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userShop'] });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    }
  });
  
  // Shop Item Mutations
  const createShopItem = useMutation({
    mutationFn: async (data: Partial<ShopItem>) => {
      const { data: item, error } = await supabase
        .from('shop_items')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return item as ShopItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shopItems', variables.shop_id] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre boutique"
      });
    }
  });
  
  const updateShopItem = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ShopItem> }) => {
      const { data: item, error } = await supabase
        .from('shop_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return item as ShopItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
    }
  });
  
  // Shop Settings Mutations
  const updateShopSettings = useMutation({
    mutationFn: async ({ shopId, data }: { shopId: string; data: Partial<ShopSettings> }) => {
      // Check if settings exist
      const { data: existingSettings } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();
      
      let result;
      
      if (existingSettings) {
        // Update existing settings
        const { data: settings, error } = await supabase
          .from('shop_settings')
          .update(data)
          .eq('shop_id', shopId)
          .select()
          .single();
        
        if (error) throw error;
        result = settings;
      } else {
        // Create new settings
        const newSettings = {
          shop_id: shopId,
          ...data
        };
        
        const { data: settings, error } = await supabase
          .from('shop_settings')
          .insert(newSettings)
          .select()
          .single();
        
        if (error) throw error;
        result = settings;
      }
      
      return mapSettings(result);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shopSettings', variables.shopId] });
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres de votre boutique ont été mis à jour"
      });
    }
  });
  
  // Export all functions
  return {
    // Queries
    getUserShop,
    getShopById,
    getShopItems,
    getShopSettings,
    getShopReviews,
    
    // Mutations
    createShop,
    updateShop,
    createShopItem,
    updateShopItem,
    updateShopSettings
  };
};
