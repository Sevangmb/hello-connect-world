
/**
 * Type guards for shop domain types
 */
import { ShopStatus } from './shop-types';
import { ShopItemStatus } from './item-types';
import { OrderStatus } from './order-types';
import { PaymentStatus } from './payment-types';
import { DeliveryOption, PaymentMethod } from './shop-types';

export const isShopStatus = (status: string): status is ShopStatus => {
  return ['pending', 'approved', 'rejected', 'suspended'].includes(status);
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

export const isDeliveryOption = (option: string): status is DeliveryOption => {
  return ['pickup', 'delivery', 'both'].includes(option);
};

export const isPaymentMethod = (method: string): status is PaymentMethod => {
  return ['card', 'paypal', 'bank_transfer', 'cash'].includes(method);
};
