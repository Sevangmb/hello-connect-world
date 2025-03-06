
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopSettings, ShopStatus, ShopItemStatus } from '@/core/shop/domain/types';

export const useShop = () => {
  const [shop, setShop] = useState<Shop>({} as Shop);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchShopByUserId = async (): Promise<Shop> => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();

      if (error) throw error;
      
      const shopWithTypedStatus = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(shopWithTypedStatus);
      return shopWithTypedStatus;
    } catch (error) {
      console.error('Error fetching shop:', error);
      return {} as Shop;
    } finally {
      setLoading(false);
    }
  };

  const fetchShopItems = async (shopId: string): Promise<ShopItem[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId);

      if (error) throw error;
      
      const itemsWithTypedStatus = data.map(item => ({
        ...item,
        status: item.status as ShopItemStatus
      }));
      
      setShopItems(itemsWithTypedStatus);
      return itemsWithTypedStatus;
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createShop = async (shopData: Partial<Shop>): Promise<Shop> => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const newShop = {
        user_id: userData.user.id,
        status: 'pending' as ShopStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...shopData
      };

      const { data, error } = await supabase
        .from('shops')
        .insert([newShop])
        .select()
        .single();

      if (error) throw error;
      
      const shopWithTypedStatus = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(shopWithTypedStatus);
      return shopWithTypedStatus;
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateShop = async (shopId: string, updates: Partial<Shop>): Promise<Shop> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId)
        .select()
        .single();

      if (error) throw error;
      
      const shopWithTypedStatus = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(shopWithTypedStatus);
      return shopWithTypedStatus;
    } catch (error) {
      console.error('Error updating shop:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createShopItem = async (item: Partial<ShopItem>): Promise<ShopItem> => {
    setLoading(true);
    try {
      const newItem = {
        status: 'available' as ShopItemStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...item
      };

      const { data, error } = await supabase
        .from('shop_items')
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;
      
      const itemWithTypedStatus = {
        ...data,
        status: data.status as ShopItemStatus
      };
      
      setShopItems(prevItems => [...prevItems, itemWithTypedStatus]);
      return itemWithTypedStatus;
    } catch (error) {
      console.error('Error creating shop item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // useCreateShop hook
  const useCreateShop = () => {
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const execute = async (shopData: Partial<Shop>): Promise<Shop | null> => {
      setCreating(true);
      setError(null);
      try {
        const result = await createShop(shopData);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return null;
      } finally {
        setCreating(false);
      }
    };

    return { execute, creating, error };
  };

  // useCreateShopItem hook
  const useCreateShopItem = () => {
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const execute = async (itemData: Partial<ShopItem>): Promise<ShopItem | null> => {
      setCreating(true);
      setError(null);
      try {
        const result = await createShopItem(itemData);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return null;
      } finally {
        setCreating(false);
      }
    };

    return { execute, creating, error };
  };

  // useUserShop hook
  const useUserShop = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [userShop, setUserShop] = useState<Shop | null>(null);

    const fetchUserShop = async (): Promise<Shop | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchShopByUserId();
        setUserShop(result);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    };

    return { userShop, loading, error, fetchUserShop };
  };

  // useShopById hook
  const useShopById = (shopId: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [shopData, setShopData] = useState<Shop | null>(null);

    const fetchShop = async (): Promise<Shop | null> => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('id', shopId)
          .single();

        if (error) throw error;
        
        const shopWithTypedStatus = {
          ...data,
          status: data.status as ShopStatus
        };
        
        setShopData(shopWithTypedStatus);
        return shopWithTypedStatus;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    };

    return { shop: shopData, loading, error, fetchShop };
  };

  // useUpdateShopSettings hook
  const useUpdateShopSettings = () => {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateSettings = async (shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> => {
      setUpdating(true);
      setError(null);
      try {
        // First check if settings exist
        const { data: existingSettings, error: checkError } = await supabase
          .from('shop_settings')
          .select('*')
          .eq('shop_id', shopId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') throw checkError;

        let result;
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
          result = data;
        } else {
          // Create new settings
          const newSettings = {
            shop_id: shopId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...settings
          };

          const { data, error } = await supabase
            .from('shop_settings')
            .insert([newSettings])
            .select()
            .single();

          if (error) throw error;
          result = data;
        }

        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return null;
      } finally {
        setUpdating(false);
      }
    };

    return { updateSettings, updating, error };
  };

  // useIsShopFavorited hook
  const useIsShopFavorited = (shopId: string) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const checkFavorite = async (): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return false;

        const { data, error } = await supabase
          .from('user_favorite_shops')
          .select('*')
          .eq('user_id', userData.user.id)
          .eq('shop_id', shopId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        const result = !!data;
        setIsFavorited(result);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    };

    const toggleFavorite = async (): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        if (isFavorited) {
          // Remove from favorites
          const { error } = await supabase
            .from('user_favorite_shops')
            .delete()
            .eq('user_id', userData.user.id)
            .eq('shop_id', shopId);

          if (error) throw error;
          setIsFavorited(false);
          return false;
        } else {
          // Add to favorites
          const { error } = await supabase
            .from('user_favorite_shops')
            .insert([
              {
                user_id: userData.user.id,
                shop_id: shopId,
                created_at: new Date().toISOString()
              }
            ]);

          if (error) throw error;
          setIsFavorited(true);
          return true;
        }
      } catch (err) {
        const error = err as Error;
        setError(error);
        return isFavorited;
      } finally {
        setLoading(false);
      }
    };

    return { isFavorited, loading, error, checkFavorite, toggleFavorite };
  };

  return {
    shop,
    shopItems,
    loading,
    fetchShopByUserId,
    fetchShopItems,
    createShop,
    updateShop,
    createShopItem,
    useCreateShop,
    useCreateShopItem,
    useUserShop,
    useShopById,
    useUpdateShopSettings,
    useIsShopFavorited
  };
};
