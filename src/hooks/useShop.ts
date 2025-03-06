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

  const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to create a shop');
      }

      const shop = {
        user_id: user.id,
        name: shopData.name || 'New Shop',
        status: shopData.status || 'pending',
        description: shopData.description || '',
        image_url: shopData.image_url,
        address: shopData.address,
        phone: shopData.phone,
        website: shopData.website,
        categories: shopData.categories,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        opening_hours: shopData.opening_hours,
      };

      const { data, error } = await supabase
        .from('shops')
        .insert(shop)
        .select()
        .single();

      if (error) throw error;
      
      return data as unknown as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
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

  const createShopItem = async (itemData: Partial<ShopItem>): Promise<ShopItem | null> => {
    try {
      const item = {
        shop_id: itemData.shop_id,
        name: itemData.name || 'New Item',
        description: itemData.description || '',
        price: itemData.price || 0,
        stock: itemData.stock || 0,
        status: itemData.status || 'available',
        clothes_id: itemData.clothes_id,
        image_url: itemData.image_url,
        original_price: itemData.original_price
      };

      if (!item.shop_id) {
        throw new Error('Shop ID is required');
      }

      const { data, error } = await supabase
        .from('shop_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      
      return data as unknown as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      return null;
    }
  };

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

  const useUpdateShopSettings = () => {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateSettings = async (shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> => {
      setUpdating(true);
      setError(null);
      try {
        const { data: existingSettings, error: checkError } = await supabase
          .from('shop_settings')
          .select('*')
          .eq('shop_id', shopId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') throw checkError;

        let result;
        if (existingSettings) {
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
          const { error } = await supabase
            .from('user_favorite_shops')
            .delete()
            .eq('user_id', userData.user.id)
            .eq('shop_id', shopId);

          if (error) throw error;
          setIsFavorited(false);
          return false;
        } else {
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
