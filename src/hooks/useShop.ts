import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopSettings, ShopStatus, ShopItemStatus, PaymentMethod, DeliveryOption } from '@/core/shop/domain/types';

export const useCreateShop = () => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (shopData: Partial<Shop>): Promise<Shop> => {
    setCreating(true);
    setError(null);
    try {
      if (!shopData.name || !shopData.user_id) {
        throw new Error('Name and user_id are required');
      }

      const { data, error } = await supabase
        .from('shops')
        .insert({
          name: shopData.name,
          user_id: shopData.user_id,
          description: shopData.description || '',
          status: shopData.status || 'pending',
          image_url: shopData.image_url,
          address: shopData.address,
          phone: shopData.phone,
          website: shopData.website,
          categories: shopData.categories || [],
          latitude: shopData.latitude,
          longitude: shopData.longitude,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  return { execute, creating, error };
};

export const useCreateShopItem = () => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (itemData: Partial<ShopItem>): Promise<ShopItem> => {
    setCreating(true);
    setError(null);
    try {
      if (!itemData.shop_id || !itemData.price) {
        throw new Error('Shop ID and price are required');
      }

      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: itemData.shop_id,
          name: itemData.name || 'Unnamed item',
          description: itemData.description || '',
          image_url: itemData.image_url,
          price: itemData.price,
          original_price: itemData.original_price,
          stock: itemData.stock || 1,
          status: itemData.status || 'available',
          clothes_id: itemData.clothes_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  return { execute, creating, error };
};

export const useUserShop = () => {
  const [userShop, setUserShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserShop = async (): Promise<Shop> => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      const shop = data as Shop;
      setUserShop(shop);
      return shop;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { userShop, loading, error, fetchUserShop };
};

export const useShopById = () => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchShop = async (id: string): Promise<Shop> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      const shopData = data as Shop;
      setShop(shopData);
      return shopData;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { shop, loading, error, fetchShop };
};

export const useUpdateShopSettings = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateSettings = async (
    shopId: string, 
    settings: Partial<ShopSettings>
  ): Promise<ShopSettings> => {
    setUpdating(true);
    setError(null);
    try {
      const { data: existingSettings, error: fetchError } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();
      
      let result;
      
      if (fetchError && fetchError.code === 'PGRST116') {
        const { data, error } = await supabase
          .from('shop_settings')
          .insert({
            shop_id: shopId,
            delivery_options: settings.delivery_options || ['pickup', 'delivery', 'both'],
            payment_methods: settings.payment_methods || ['card', 'paypal', 'bank_transfer', 'cash'],
            auto_accept_orders: settings.auto_accept_orders !== undefined ? settings.auto_accept_orders : false,
            notification_preferences: settings.notification_preferences || { email: true, app: true },
          })
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('shop_settings')
          .update({
            delivery_options: settings.delivery_options || existingSettings.delivery_options,
            payment_methods: settings.payment_methods || existingSettings.payment_methods,
            auto_accept_orders: settings.auto_accept_orders !== undefined 
              ? settings.auto_accept_orders 
              : existingSettings.auto_accept_orders,
            notification_preferences: settings.notification_preferences || existingSettings.notification_preferences,
            updated_at: new Date().toISOString(),
          })
          .eq('shop_id', shopId)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      return result as ShopSettings;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  return { updateSettings, updating, error };
};

export const useIsShopFavorited = (shopId: string) => {
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
