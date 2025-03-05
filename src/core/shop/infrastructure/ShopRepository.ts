
// Only update the problematic updateShopSettings method
async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
  try {
    const { data, error } = await supabase
      .from('shop_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('shop_id', shopId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating shop settings:', error);
      throw new Error(`Failed to update shop settings: ${error.message}`);
    }

    return data as ShopSettings;
  } catch (error) {
    console.error('Exception in updateShopSettings:', error);
    throw new Error('Failed to update shop settings');
  }
}

// Fix createOrder method to properly handle the order data
async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
  try {
    // First create the order in the orders table
    const { data: order, error: orderError } = await supabase
      .from('shop_orders')
      .insert({
        shop_id: orderData.shop_id,
        customer_id: orderData.customer_id,
        status: orderData.status,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee,
        payment_status: orderData.payment_status,
        payment_method: orderData.payment_method,
        delivery_address: orderData.delivery_address,
      })
      .select('*')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // Then create the order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      shop_item_id: item.shop_item_id || item.item_id,
      name: item.name,
      price: item.price_at_time || item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('shop_order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Try to delete the order if items creation failed
      await supabase.from('shop_orders').delete().eq('id', order.id);
      return null;
    }

    // Get complete order with items
    return this.getOrderById(order.id);
  } catch (error) {
    console.error('Exception in createOrder:', error);
    return null;
  }
}
