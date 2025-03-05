
/**
 * Types pour le domaine des commandes
 */

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type DeliveryType = 'in_person' | 'shipping' | 'pickup';

export interface OrderItem {
  id: string;
  orderId: string;
  shopItemId: string;
  quantity: number;
  priceAtTime: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  commissionAmount?: number;
  createdAt: string;
  updatedAt?: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  deliveryType: DeliveryType;
  shippingAddress?: ShippingAddress;
  shippingRequired?: boolean;
  shippingCost?: number;
  paymentMethod?: string;
  items?: OrderItem[];
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  state?: string;
}

export interface OrderCreateRequest {
  buyerId: string;
  sellerId: string;
  items: {
    shopItemId: string;
    quantity: number;
  }[];
  deliveryType: DeliveryType;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
}

export interface OrderUpdateRequest {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
}

export interface OrderResult {
  order: Order | null;
  error?: string;
}

export interface OrdersResult {
  orders: Order[];
  count: number;
  error?: string;
}
