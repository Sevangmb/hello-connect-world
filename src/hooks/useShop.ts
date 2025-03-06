
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopReview, ShopSettings, ShopStatus, Order, PaymentMethod, DeliveryOption } from '@/core/shop/domain/types';
import { useToast } from '@/hooks/use-toast';

// Define a type for Json since it's missing from supabase-js exports
type Json = any;

// Export a main hook that provides access to all other hooks
export const useShop = () => {
  const { 
    shop, 
    shopItems, 
    loading, 
    fetchShopByUserId, 
    fetchShopItems, 
    createShop, 
    updateShop, 
    createShopItem 
  } = useUserShop();

  return {
    shop,
    shopItems,
    loading,
    fetchShopByUserId,
    fetchShopItems,
    createShop,
    updateShop,
    createShopItem
  };
};

// User shop management hook
export const useUserShop = () => {
  const [shop, setShop] = useState<Shop>({} as Shop);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchShopByUserId = async (): Promise<Shop> => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      // Type assertion to convert the string status to ShopStatus
      const typedShop: Shop = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(typedShop);
      return typedShop;
    } catch (error) {
      console.error('Error fetching shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch shop information',
        variant: 'destructive',
      });
      return {} as Shop;
    } finally {
      setLoading(false);
    }
  };

  const fetchShopItems = async (shopId: string): Promise<ShopItem[]> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('shop_id', shopId);
      
      if (error) throw error;
      
      const typedItems: ShopItem[] = data.map(item => ({
        ...item,
        status: item.status as any // Type cast to ShopItemStatus
      }));
      
      setShopItems(typedItems);
      return typedItems;
    } catch (error) {
      console.error('Error fetching shop items:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch shop items',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createShop = async (shopData: Partial<Shop>): Promise<Shop> => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Ensure required fields are present
      const newShop = {
        user_id: user.id,
        name: shopData.name || 'My Shop',
        description: shopData.description || '',
        status: shopData.status || 'pending',
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
      
      // Type assertion for status
      const typedShop: Shop = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(typedShop);
      toast({
        title: 'Success',
        description: 'Shop created successfully',
      });
      
      return typedShop;
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shop',
        variant: 'destructive',
      });
      return {} as Shop;
    } finally {
      setLoading(false);
    }
  };

  const updateShop = async (shopId: string, updates: Partial<Shop>): Promise<Shop> => {
    try {
      setLoading(true);
      
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
      
      // Type assertion for status
      const typedShop: Shop = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(typedShop);
      toast({
        title: 'Success',
        description: 'Shop updated successfully',
      });
      
      return typedShop;
    } catch (error) {
      console.error('Error updating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shop',
        variant: 'destructive',
      });
      return {} as Shop;
    } finally {
      setLoading(false);
    }
  };

  const createShopItem = async (item: Partial<ShopItem>): Promise<ShopItem> => {
    try {
      setLoading(true);
      
      // Ensure required fields are present
      const newItem = {
        name: item.name || 'New Item',
        price: item.price || 0,
        stock: item.stock || 1,
        status: item.status || 'available',
        shop_id: item.shop_id,
        clothes_id: item.clothes_id,
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
      
      const newItems = [...shopItems, data];
      setShopItems(newItems);
      
      toast({
        title: 'Success',
        description: 'Item added successfully',
      });
      
      return data;
    } catch (error) {
      console.error('Error creating shop item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive',
      });
      return {} as ShopItem;
    } finally {
      setLoading(false);
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
    createShopItem
  };
};

// Hook to manage shop by ID
export const useShopById = (shopId?: string) => {
  const [shop, setShop] = useState<Shop>({} as Shop);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchShop = async (id: string): Promise<Shop> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Type assertion to convert the string status to ShopStatus
      const typedShop: Shop = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(typedShop);
      return typedShop;
    } catch (error) {
      console.error(`Error fetching shop with ID ${shopId}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to fetch shop information',
        variant: 'destructive',
      });
      return {} as Shop;
    } finally {
      setLoading(false);
    }
  };

  return {
    shop,
    loading,
    fetchShop
  };
};

// Hook for favoriting shops
export const useIsShopFavorited = (shopId?: string) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkIfFavorited = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', user.id)
        .eq('shop_id', id)
        .maybeSingle();
      
      if (error) throw error;
      
      const favorited = !!data;
      setIsFavorited(favorited);
      return favorited;
    } catch (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorite_shops')
          .delete()
          .eq('user_id', user.id)
          .eq('shop_id', id);
        
        if (error) throw error;
        
        setIsFavorited(false);
        toast({
          title: 'Removed from favorites',
          description: 'Shop has been removed from your favorites',
        });
        
        return false;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorite_shops')
          .insert({
            user_id: user.id,
            shop_id: id,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        setIsFavorited(true);
        toast({
          title: 'Added to favorites',
          description: 'Shop has been added to your favorites',
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error toggling shop favorite status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'destructive',
      });
      return isFavorited;
    } finally {
      setLoading(false);
    }
  };

  return {
    isFavorited,
    loading,
    checkIfFavorited,
    toggleFavorite
  };
};

// Hook for creating shop items
export const useCreateShopItem = (shopId?: string) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createItem = async (item: Partial<ShopItem>): Promise<ShopItem> => {
    try {
      setLoading(true);
      
      // Ensure required fields are present
      const newItem = {
        shop_id: shopId || item.shop_id,
        name: item.name || 'New Item',
        price: item.price || 0,
        stock: item.stock || 1,
        status: 'available',
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
      
      toast({
        title: 'Success',
        description: 'Item added successfully',
      });
      
      return data;
    } catch (error) {
      console.error('Error creating shop item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive',
      });
      return {} as ShopItem;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createItem
  };
};

// Hook for creating shops
export const useCreateShop = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createShop = async (shopData: Partial<Shop>): Promise<Shop> => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Ensure required fields are present
      const newShop = {
        user_id: user.id,
        name: shopData.name || 'My Shop',
        description: shopData.description || '',
        status: 'pending',
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
      
      toast({
        title: 'Success',
        description: 'Shop created successfully',
      });
      
      // Type assertion for status
      return {
        ...data,
        status: data.status as ShopStatus
      };
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shop',
        variant: 'destructive',
      });
      return {} as Shop;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createShop
  };
};

// Hook for updating shop settings
export const useUpdateShopSettings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateSettings = async (shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> => {
    try {
      setLoading(true);
      
      // Check if settings exist
      const { data: existingSettings, error: checkError } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
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
          delivery_options: settings.delivery_options || ['pickup'],
          payment_methods: settings.payment_methods || ['card'],
          auto_accept_orders: settings.auto_accept_orders || false,
          notification_preferences: settings.notification_preferences || {
            email: true,
            app: true
          },
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
      
      toast({
        title: 'Success',
        description: 'Shop settings updated successfully',
      });
      
      return result;
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shop settings',
        variant: 'destructive',
      });
      return {} as ShopSettings;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateSettings
  };
};
