
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopSettings, mapShop, mapSettings } from '../../domain/types';

export class ShopRepository {
  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles:user_id(username, full_name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop:', error);
      return null;
    }

    // Get settings
    const settings = await this.getShopSettings(id);
    
    const shop = mapShop(data);
    if (shop) {
      shop.settings = settings || undefined;
    }
    
    return shop;
  }

  async getUserShops(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles:user_id(username, full_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user shops:', error);
      return [];
    }

    // Map shops
    const shops = data.map(shop => mapShop(shop)).filter(shop => shop !== null) as Shop[];
    
    // Get settings for each shop
    for (const shop of shops) {
      shop.settings = await this.getShopSettings(shop.id) || undefined;
    }
    
    return shops;
  }

  async updateShop(id: string, updates: Partial<Shop>): Promise<Shop | null> {
    // Extract settings to update separately if provided
    const { settings, ...shopUpdates } = updates;
    
    // Update shop
    const { data, error } = await supabase
      .from('shops')
      .update({
        ...shopUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, profiles:user_id(username, full_name)')
      .single();

    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }

    // Update settings if provided
    if (settings) {
      await this.updateShopSettings(id, settings);
    }

    // Get updated settings
    const updatedSettings = await this.getShopSettings(id);
    
    const shop = mapShop(data);
    if (shop) {
      shop.settings = updatedSettings || undefined;
    }
    
    return shop;
  }

  async createShop(newShop: Partial<Shop>): Promise<Shop | null> {
    // Extract settings to create separately if provided
    const { settings, ...shopData } = newShop;
    
    // Ensure required fields have default values
    const shopToCreate = {
      user_id: shopData.user_id,
      name: shopData.name || 'New Shop',
      description: shopData.description || '',
      status: shopData.status || 'pending',
      average_rating: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...shopData
    };
    
    // Create shop
    const { data, error } = await supabase
      .from('shops')
      .insert(shopToCreate)
      .select('*, profiles:user_id(username, full_name)')
      .single();

    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }

    const shop = mapShop(data);
    
    // Create settings if provided
    if (shop && settings) {
      const createdSettings = await this.updateShopSettings(shop.id, {
        ...settings,
        shop_id: shop.id
      });
      
      if (shop) {
        shop.settings = createdSettings || undefined;
      }
    }
    
    return shop;
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('shop_id', shopId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Settings not found, which is OK
        return null;
      }
      console.error('Error fetching shop settings:', error);
      return null;
    }

    return mapSettings(data);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    // Check if settings exist for this shop
    const existingSettings = await this.getShopSettings(shopId);
    
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

      if (error) {
        console.error('Error updating shop settings:', error);
        return null;
      }

      return mapSettings(data);
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('shop_settings')
        .insert({
          shop_id: shopId,
          delivery_options: settings.delivery_options || ['pickup'],
          payment_methods: settings.payment_methods || ['card'],
          auto_accept_orders: settings.auto_accept_orders || false,
          notification_preferences: settings.notification_preferences || {
            email: true,
            app: true
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating shop settings:', error);
        return null;
      }

      return mapSettings(data);
    }
  }
}
