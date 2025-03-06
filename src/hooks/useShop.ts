
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopSettings } from '@/core/shop/domain/types';
import { getCurrentUser } from '@/integrations/supabase/client';

// Custom hooks for shop operations
export const useCreateShop = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createShop = useCallback(async (shopData: Partial<Shop>) => {
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('shops')
        .insert({
          ...shopData,
          user_id: user.id,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating shop:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createShop, loading, error };
};

export const useCreateShopItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createShopItem = useCallback(async (itemData: Partial<ShopItem>) => {
    setLoading(true);
    setError(null);
    try {
      if (!itemData.shop_id) {
        throw new Error('Shop ID is required');
      }

      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          ...itemData,
          status: 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating shop item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createShopItem, loading, error };
};

export const useUserShop = () => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserShop = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      setShop(data || null);
      return data || null;
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching user shop:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserShop();
  }, [fetchUserShop]);

  return { shop, loading, error, refetch: fetchUserShop };
};

export const useShopById = (shopId: string) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShop = useCallback(async () => {
    if (!shopId) {
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();

      if (error) throw error;
      setShop(data);
      return data;
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching shop ${shopId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  return { shop, loading, error, refetch: fetchShop };
};

export const useIsShopFavorited = (shopId: string) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkFavoriteStatus = useCallback(async () => {
    if (!shopId) {
      setLoading(false);
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return false;
      }

      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', user.id)
        .eq('shop_id', shopId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsFavorited(!!data);
      return !!data;
    } catch (err) {
      setError(err as Error);
      console.error('Error checking if shop is favorited:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  return { isFavorited, loading, error, refetch: checkFavoriteStatus };
};

export const useUpdateShopSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateSettings = useCallback(async (shopId: string, settings: Partial<ShopSettings>) => {
    setLoading(true);
    setError(null);
    try {
      // First check if settings exist
      const { data: existingSettings, error: fetchError } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('shop_settings')
          .update({
            ...settings,
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
            ...settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error updating shop settings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateSettings, loading, error };
};
