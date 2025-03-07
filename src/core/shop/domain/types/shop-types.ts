
/**
 * Types for shop entities
 */

// Statuts possibles pour une boutique
export type ShopStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

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

// Options de livraison
export type DeliveryOption = 'pickup' | 'delivery' | 'both';

// Types de paiement acceptés
export type PaymentMethod = 'card' | 'paypal' | 'bank_transfer' | 'cash';
