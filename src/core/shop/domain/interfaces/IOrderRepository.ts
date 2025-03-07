
import { Order } from '../types';

export interface IOrderRepository {
  getShopOrders(shopId: string): Promise<Order[]>;
  getCustomerOrders(customerId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null>;
  updateOrderStatus(id: string, status: string): Promise<boolean>;
  updatePaymentStatus(id: string, status: string): Promise<boolean>;
}
