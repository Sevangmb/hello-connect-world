
/**
 * Mappers for shop domain entities
 */
import { Shop, ShopReview, ShopSettings, isDeliveryOption, isPaymentMethod } from './shop-types';
import { ShopItem, isShopItemStatus } from './item-types';
import { Order, DbOrder, isOrderStatus } from './order-types';
import { isPaymentStatus } from './payment-types';
import { isShopStatus } from './type-guards';

/**
 * Fonctions de mappage pour convertir les données brutes en objets de domaine typés
 */

export const mapShop = (data: any): Shop | null => {
  if (!data) return null;
  
  // Créer la boutique avec valeurs par défaut sécurisées
  const shop: Shop = {
    id: data.id,
    user_id: data.user_id,
    name: data.name || 'Unnamed Shop',
    description: data.description || '',
    image_url: data.image_url,
    address: data.address,
    phone: data.phone,
    website: data.website,
    status: isShopStatus(data.status) ? data.status : 'pending',
    categories: data.categories || [],
    average_rating: data.average_rating || 0,
    total_ratings: data.total_ratings,
    rating_count: data.rating_count,
    latitude: data.latitude,
    longitude: data.longitude,
    opening_hours: data.opening_hours,
    created_at: data.created_at,
    updated_at: data.updated_at || data.created_at,
    profiles: data.profiles
  };
  
  return shop;
};

export const mapShopItem = (data: any): ShopItem | null => {
  if (!data) return null;
  
  return {
    id: data.id,
    shop_id: data.shop_id,
    name: data.name || 'Unnamed Item',
    description: data.description || '',
    image_url: data.image_url,
    price: data.price || 0,
    original_price: data.original_price,
    stock: data.stock || 0,
    status: isShopItemStatus(data.status) ? data.status : 'available',
    created_at: data.created_at,
    updated_at: data.updated_at || data.created_at,
    clothes_id: data.clothes_id,
    shop: data.shop
  };
};

export const mapShopItems = (items: any[]): ShopItem[] => {
  return items.map(item => mapShopItem(item)).filter(item => item !== null) as ShopItem[];
};

export const mapSettings = (data: any): ShopSettings | null => {
  if (!data) return null;
  
  return {
    id: data.id,
    shop_id: data.shop_id,
    delivery_options: Array.isArray(data.delivery_options) 
      ? data.delivery_options.filter(isDeliveryOption)
      : [],
    payment_methods: Array.isArray(data.payment_methods) 
      ? data.payment_methods.filter(isPaymentMethod)
      : [],
    auto_accept_orders: data.auto_accept_orders || false,
    notification_preferences: data.notification_preferences || {
      email: true,
      app: true
    },
    created_at: data.created_at,
    updated_at: data.updated_at || data.created_at
  };
};

export const mapOrder = (data: any): Order | null => {
  if (!data) return null;
  
  // Créer la commande avec valeurs par défaut sécurisées
  const order: Order = {
    id: data.id,
    shop_id: data.shop_id || data.seller_id,
    customer_id: data.customer_id || data.buyer_id,
    status: isOrderStatus(data.status) ? data.status : 'pending',
    total_amount: data.total_amount || 0,
    delivery_fee: data.delivery_fee || 0,
    payment_status: isPaymentStatus(data.payment_status) ? data.payment_status : 'pending',
    payment_method: data.payment_method || 'card',
    delivery_address: data.delivery_address || {
      street: '',
      city: '',
      postal_code: '',
      country: ''
    },
    created_at: data.created_at,
    updated_at: data.updated_at || data.created_at,
    items: data.items || [],
    buyer_id: data.buyer_id,
    seller_id: data.seller_id
  };
  
  return order;
};

export const mapOrders = (orders: any[]): Order[] => {
  return orders.map(order => mapOrder(order)).filter(order => order !== null) as Order[];
};

export const mapShopReview = (data: any): ShopReview | null => {
  if (!data) return null;
  
  return {
    id: data.id,
    shop_id: data.shop_id,
    user_id: data.user_id,
    rating: data.rating || 0,
    comment: data.comment,
    created_at: data.created_at,
    updated_at: data.updated_at || data.created_at,
    profiles: data.profiles
  };
};

export const mapShopReviews = (reviews: any[]): ShopReview[] => {
  return reviews.map(review => mapShopReview(review)).filter(review => review !== null) as ShopReview[];
};
