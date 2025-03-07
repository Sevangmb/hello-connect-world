
import { 
  ShopStatus,
  PaymentMethod,
  DeliveryOption,
  ShopItemStatus,
  OrderStatus,
  PaymentStatus
} from '../types';

/**
 * Vérifications de type pour les valeurs énumérées
 */

export const isShopStatus = (status: string): status is ShopStatus => {
  return ['pending', 'approved', 'rejected', 'suspended'].includes(status);
};

export const isDeliveryOption = (option: string): option is DeliveryOption => {
  return ['pickup', 'delivery', 'both'].includes(option);
};

export const isPaymentMethod = (method: string): method is PaymentMethod => {
  return ['card', 'paypal', 'bank_transfer', 'cash'].includes(method);
};

export const isShopItemStatus = (status: string): status is ShopItemStatus => {
  return ['available', 'sold_out', 'archived'].includes(status);
};

export const isOrderStatus = (status: string): status is OrderStatus => {
  return ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'].includes(status);
};

export const isPaymentStatus = (status: string): status is PaymentStatus => {
  return ['pending', 'paid', 'refunded', 'failed'].includes(status);
};
