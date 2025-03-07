
/**
 * Types for orders
 */
import { PaymentStatus } from './payment-types';

// Statuts des commandes
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

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
