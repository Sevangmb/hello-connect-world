
/**
 * Types du domaine pour le service de commandes
 */

// Status des commandes
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'completed';

// Status des paiements
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Status des livraisons
export type ShippingStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | null;

// Type de livraison
export type DeliveryType = 'in_person' | 'shipping' | 'pickup';

// Interface pour l'adresse de livraison
export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
  phoneNumber?: string;
  additionalInfo?: string;
}

// Interface pour un article de commande
export interface OrderItem {
  id: string;
  shopItemId: string;
  quantity: number;
  price: number;
  // Propriétés additionnelles pour les données du produit
  productName?: string;
  imageUrl?: string | null;
  brand?: string | null;
  category?: string | null;
  size?: string | null;
}

// Interface pour une commande
export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus?: ShippingStatus;
  totalAmount: number;
  commissionAmount: number;
  createdAt: string;
  updatedAt?: string | null;
  stripePaymentIntentId?: string | null;
  stripeSessionId?: string | null;
  deliveryType: DeliveryType;
  shippingAddress?: ShippingAddress | null;
  shippingRequired: boolean;
  shippingCost: number;
  paymentMethod: string;
  items: OrderItem[];
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  transactionType?: string;
}

// Interface pour les paramètres de création d'une commande
export interface CreateOrderParams {
  buyerId: string;
  sellerId: string;
  items: {
    shopItemId: string;
    quantity: number;
    price: number;
  }[];
  commissionAmount?: number;
  deliveryType?: DeliveryType;
  shippingRequired?: boolean;
  shippingCost?: number;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  transactionType?: string;
}

// Interface pour les filtres de recherche des commandes
export interface OrderFilter {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  createdAfter?: Date;
  createdBefore?: Date;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Interface pour les récapitulatifs par statut
export interface OrderStatusSummary {
  status: OrderStatus;
  count: number;
}

// Interface pour les statistiques des commandes
export interface OrderStats {
  totalOrders: number;
  totalAmount: number;
  bySeller: Record<string, number>;
  byStatus: OrderStatusSummary[];
}
