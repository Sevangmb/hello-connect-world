
// Ajoutons cette méthode de mappage pour transformer les items de commande
private mapOrderItems(items: any[]): OrderItem[] {
  return items.map(item => ({
    id: item.id,
    order_id: item.order_id,
    item_id: item.item_id,
    name: item.name || 'Produit sans nom', // Valeur par défaut
    price: item.price_at_time,
    quantity: item.quantity,
    created_at: item.created_at,
    shop_item_id: item.item_id, // Compatibilité avec les types
    price_at_time: item.price_at_time
  }));
}

// Remplacer la méthode getOrders pour utiliser le mappage
async getOrders(shopId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('shop_orders')
    .select(`
      *,
      items:shop_order_items(*)
    `)
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shop orders:', error);
    return [];
  }

  // Transform database data to match the domain model
  return data.map(order => ({
    id: order.id,
    shop_id: order.shop_id,
    customer_id: order.customer_id,
    status: order.status as OrderStatus,
    total_amount: order.total_amount,
    delivery_fee: order.delivery_fee,
    payment_status: order.payment_status as PaymentStatus,
    payment_method: 'card', // Default value since it's not in the database
    delivery_address: order.delivery_address as any, // Handle the JSON conversion
    created_at: order.created_at,
    updated_at: order.updated_at,
    items: this.mapOrderItems(order.items || [])
  }));
}

// Remplacer la méthode getOrderById pour utiliser le mappage
async getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('shop_orders')
    .select(`
      *,
      items:shop_order_items(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return {
    id: data.id,
    shop_id: data.shop_id,
    customer_id: data.customer_id,
    status: data.status as OrderStatus,
    total_amount: data.total_amount,
    delivery_fee: data.delivery_fee,
    payment_status: data.payment_status as PaymentStatus,
    payment_method: 'card', // Default value since it's not in the database
    delivery_address: data.delivery_address as any, // Handle the JSON conversion
    created_at: data.created_at,
    updated_at: data.updated_at,
    items: this.mapOrderItems(data.items || [])
  };
}

// Corriger la méthode createOrder pour utiliser price_at_time
async createOrder(orderData: any): Promise<Order> {
  // Insert the order
  const { data: orderResult, error: orderError } = await supabase
    .from('shop_orders')
    .insert({
      shop_id: orderData.shop_id,
      customer_id: orderData.customer_id,
      status: orderData.status,
      total_amount: orderData.total_amount,
      delivery_fee: orderData.delivery_fee,
      payment_status: orderData.payment_status,
      delivery_address: orderData.delivery_address
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  // Insert order items
  if (orderData.items && orderData.items.length > 0) {
    const orderItems = orderData.items.map((item: any) => ({
      order_id: orderResult.id,
      item_id: item.item_id,
      quantity: item.quantity,
      price_at_time: item.price || 0
    }));

    const { error: itemsError } = await supabase
      .from('shop_order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }
  }

  // Return the full order with items
  return this.getOrderById(orderResult.id) as Promise<Order>;
}
