
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
  settings?: ShopSettings; // Add the settings property
}

// Article de boutique
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

// Raw shop item from database
export interface RawShopItem {
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
}

// Élément du panier
export interface CartItem {
  id: string;
  user_id: string;
  shop_id: string;
  item_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  shop_items: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    shop_id: string;
  };
  shop: {
    id: string;
    name: string;
  };
}

// Article dans une commande
export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  shop_item_id?: string; // Added for database compatibility
  price_at_time?: number; // Added for database compatibility
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
  payment_method?: string;
  delivery_address: any;
  created_at: string;
  updated_at: string;
  items?: any[];
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
