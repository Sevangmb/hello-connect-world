
/**
 * Types du domaine de la boutique
 */

export type ShopStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Shop {
  id: string;
  name: string;
  description: string;
  user_id: string;
  image_url?: string;
  status: ShopStatus;
  average_rating?: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
  };
}

export interface ShopItem {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  stock: number;
  image_url?: string;
  status: 'available' | 'sold_out' | 'archived';
  created_at: string;
  updated_at: string;
  clothes_id?: string;
}

export interface ShopSettings {
  shop_id: string;
  delivery_options: DeliveryOption[];
  payment_methods: PaymentMethod[];
  return_policy?: string;
  auto_accept_orders: boolean;
  notification_preferences: NotificationPreferences;
  updated_at: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  estimated_days: number;
  is_enabled: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  is_enabled: boolean;
}

export interface NotificationPreferences {
  new_order: boolean;
  order_status_change: boolean;
  low_stock: boolean;
  email: boolean;
  in_app: boolean;
}

export interface Order {
  id: string;
  shop_id: string;
  customer_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_fee: number;
  payment_status: PaymentStatus;
  delivery_address: Address;
  delivery_method: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  buyer_id?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  price: number;
  name: string;
  image_url?: string;
}

export interface Address {
  street: string;
  city: string;
  postal_code: string;
  country: string;
  state?: string;
  additional_info?: string;
}

export interface ShopReview {
  id: string;
  shop_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
  };
}

export interface ShopStatistics {
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  monthly_revenue: number[];
  stock_value: number;
}
