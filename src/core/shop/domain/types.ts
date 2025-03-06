
/**
 * Types du module de boutique
 */

// Statuts possibles pour une boutique
export type ShopStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

// Types de paiement acceptés
export type PaymentMethod = 'card' | 'paypal' | 'bank_transfer' | 'cash';

// Options de livraison
export type DeliveryOption = 'pickup' | 'delivery' | 'both';

// Statuts des articles
export type ShopItemStatus = 'available' | 'sold_out' | 'archived';

// Statuts des commandes
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

// Statuts de paiement
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

// Boutique
export interface Shop {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url?: string;
  address?: string;
  phone?: string;
  website?: string;
  status: ShopStatus;
  categories?: string[];
  average_rating: number;
  total_ratings?: number;
  rating_count?: number;
  latitude?: number;
  longitude?: number;
  opening_hours?: any;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
  };
  settings?: ShopSettings;
}

// Types pour les articles
export interface ShopItem {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  stock: number;
  status: ShopItemStatus;
  created_at: string;
  updated_at: string;
  clothes_id?: string;
  shop?: {
    name: string;
  };
}

// Élément du panier
export interface CartItem {
  id: string;
  user_id: string;
  shop_id: string;
  shop_item_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  shop_items: {
    name: string;
    price: number;
    image_url?: string;
    id: string;
  };
  shop: {
    name: string;
    id: string;
  };
}

// Base cart item for DB operations
export interface DbCartItem {
  id?: string;
  user_id: string;
  shop_item_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

// Article dans une commande
export interface OrderItem {
  id: string;
  order_id: string;
  shop_item_id: string;
  price_at_time: number;
  quantity: number;
  created_at: string;
  name?: string;
}

// Commande
export interface Order {
  id: string;
  shop_id: string;
  customer_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_fee: number;
  payment_status: PaymentStatus;
  payment_method: string;
  delivery_address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  
  // Champs compatibles avec les données de la DB
  buyer_id?: string;
  seller_id?: string;
}

// Database Order
export interface DbOrder {
  id: string;
  shop_id: string;
  customer_id: string;
  status: string;
  total_amount: number;
  delivery_fee: number;
  payment_status: string;
  payment_method: string;
  delivery_address: any;
  created_at: string;
  updated_at: string;
  items?: any[];
  
  // Champs compatibles avec les données de la DB
  buyer_id?: string;
  seller_id?: string;
}

// Avis sur une boutique
export interface ShopReview {
  id: string;
  shop_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
  };
}

// Paramètres de boutique
export interface ShopSettings {
  id: string;
  shop_id: string;
  delivery_options: DeliveryOption[];
  payment_methods: PaymentMethod[];
  auto_accept_orders: boolean;
  notification_preferences: {
    email: boolean;
    app: boolean;
  };
  created_at: string;
  updated_at: string;
}

// Add type guards and mappers to handle Supabase response types
export const isShopStatus = (status: string): status is ShopStatus => {
  return ['pending', 'approved', 'rejected', 'suspended'].includes(status);
};

export const mapShopFromDB = (shop: any): Shop => {
  return {
    ...shop,
    status: isShopStatus(shop.status) ? shop.status : 'pending'
  };
};

export const isDeliveryOption = (option: string): option is DeliveryOption => {
  return ['pickup', 'delivery', 'both'].includes(option);
};

export const mapDeliveryOptions = (options: string[]): DeliveryOption[] => {
  return options.filter(isDeliveryOption);
};

export const isPaymentMethod = (method: string): method is PaymentMethod => {
  return ['card', 'paypal', 'bank_transfer', 'cash'].includes(method);
};

export const mapPaymentMethods = (methods: string[]): PaymentMethod[] => {
  return methods.filter(isPaymentMethod);
};

export const isShopItemStatus = (status: string): status is ShopItemStatus => {
  return ['available', 'sold_out', 'archived'].includes(status);
};

export const mapShopItem = (item: any): ShopItem => {
  return {
    ...item,
    status: isShopItemStatus(item.status) ? item.status : 'available',
    shop: item.shop || { name: 'Unknown' }
  };
};

export const mapShopItems = (items: any[]): ShopItem[] => {
  return items.map(mapShopItem);
};

export const isOrderStatus = (status: string): status is OrderStatus => {
  return ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'].includes(status);
};

export const isPaymentStatus = (status: string): status is PaymentStatus => {
  return ['pending', 'paid', 'refunded', 'failed'].includes(status);
};

export const mapOrder = (order: any): Order => {
  // Create base order with required fields
  const mappedOrder: Order = {
    id: order.id,
    shop_id: order.shop_id || order.seller_id,
    customer_id: order.customer_id || order.buyer_id,
    status: isOrderStatus(order.status) ? order.status : 'pending',
    total_amount: order.total_amount,
    delivery_fee: order.delivery_fee || 0,
    payment_status: isPaymentStatus(order.payment_status) ? order.payment_status : 'pending',
    payment_method: order.payment_method || 'card',
    delivery_address: order.delivery_address || {
      street: '',
      city: '',
      postal_code: '',
      country: ''
    },
    created_at: order.created_at,
    updated_at: order.updated_at || order.created_at,
    items: order.items || [],
    buyer_id: order.buyer_id,
    seller_id: order.seller_id
  };
  
  return mappedOrder;
};

export const mapOrders = (orders: any[]): Order[] => {
  return orders.map(mapOrder);
};

export const mapSettings = (settings: any): ShopSettings => {
  if (!settings) return null;
  
  return {
    id: settings.id,
    shop_id: settings.shop_id,
    delivery_options: settings.delivery_options 
      ? mapDeliveryOptions(settings.delivery_options)
      : [],
    payment_methods: settings.payment_methods 
      ? mapPaymentMethods(settings.payment_methods)
      : [],
    auto_accept_orders: settings.auto_accept_orders || false,
    notification_preferences: settings.notification_preferences || {
      email: true,
      app: true
    },
    created_at: settings.created_at,
    updated_at: settings.updated_at
  };
};

export const mapCartItem = (item: any): CartItem => {
  if (!item) return null;
  
  return {
    id: item.id,
    user_id: item.user_id,
    shop_id: item.shop_id || 'unknown',
    shop_item_id: item.shop_item_id,
    quantity: item.quantity,
    created_at: item.created_at,
    updated_at: item.updated_at,
    shop_items: item.shop_items || {
      name: 'Unknown',
      price: 0,
      id: 'unknown'
    },
    shop: item.shop || {
      name: 'Unknown',
      id: 'unknown'
    }
  };
};
