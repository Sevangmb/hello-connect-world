
// Fix type conversion issues in mapDbItemToShopItem function
private mapDbItemToShopItem(item: any): ShopItem {
  return {
    id: item.id,
    shop_id: item.shop_id,
    name: item.name,
    description: item.description || '',
    image_url: item.image_url,
    price: item.price,
    original_price: item.original_price,
    stock: item.stock,
    status: item.status as ShopItemStatus, // Cast the string to ShopItemStatus
    created_at: item.created_at,
    updated_at: item.updated_at,
    clothes_id: item.clothes_id,
    // Only add shop if it exists and has name
    shop: item.shop && typeof item.shop === 'object' ? { name: item.shop.name || '' } : undefined
  };
}

// Fix map usage in getShopItems method
async getShopItems(shopId: string): Promise<ShopItem[]> {
  try {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .eq('shop_id', shopId);
    
    if (error) throw error;
    
    return data.map((item: any) => this.mapDbItemToShopItem(item));
  } catch (err) {
    console.error('Error fetching shop items:', err);
    return [];
  }
}

// Fix the addShopItems method to correctly map data
async addShopItems(items: Omit<ShopItem, "id" | "created_at" | "updated_at">[]): Promise<boolean> {
  try {
    // Make sure each item has the required fields
    const validItems = items.map(item => ({
      shop_id: item.shop_id,
      name: item.name,
      description: item.description || '',
      image_url: item.image_url,
      price: item.price,
      original_price: item.original_price,
      stock: item.stock,
      status: item.status,
      clothes_id: item.clothes_id || null
    }));
    
    const { error } = await supabase
      .from('shop_items')
      .insert(validItems);
    
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error('Error adding shop items:', err);
    return false;
  }
}

// Fix the createOrder type issue with DbOrder
async createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<string | null> {
  try {
    // Explicitly map the order to match the database schema
    const dbOrder = {
      shop_id: order.shop_id,
      customer_id: order.customer_id,
      status: order.status,
      total_amount: order.total_amount,
      delivery_fee: order.delivery_fee,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      delivery_address: order.delivery_address,
      updated_at: new Date().toISOString()
    };
    
    // Insert the order
    const { data: orderData, error: orderError } = await supabase
      .from('shop_orders')
      .insert(dbOrder)
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Process the order items separately
    if (order.items && order.items.length > 0) {
      const orderItems = order.items.map(item => ({
        order_id: orderData.id,
        item_id: item.item_id,     // Use item_id instead of shop_item_id
        price_at_time: item.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('shop_order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
    }
    
    return orderData.id;
  } catch (err) {
    console.error('Error creating order:', err);
    return null;
  }
}

// Fix addToCart method signature to match interface
async addToCart(userId: string, itemId: string, quantity: number): Promise<boolean> {
  try {
    // Create cart item with required fields
    const cartItem = {
      user_id: userId,
      shop_item_id: itemId, // Use shop_item_id not item_id
      quantity: quantity
    };
    
    const { error } = await supabase
      .from('cart_items')
      .insert(cartItem);
    
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error('Error adding to cart:', err);
    return false;
  }
}

// Fix getCartItems type conversion
async getCartItems(userId: string): Promise<CartItem[]> {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        shop_items(id, name, price, image_url, shop_id),
        shop:shop_items(shop:shops(id, name))
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Map the data to CartItem type
    return data.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      item_id: item.shop_item_id, // Map shop_item_id to item_id
      shop_id: item.shop_items?.shop_id || '',
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
      shop_items: item.shop_items,
      shop: {
        id: item.shop_items?.shop?.id || '',
        name: item.shop_items?.shop?.name || ''
      }
    })) as CartItem[];
  } catch (err) {
    console.error('Error fetching cart items:', err);
    return [];
  }
}
