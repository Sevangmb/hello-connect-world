
/**
 * Fournisseur de dépendances pour les commandes
 * Point d'entrée unique pour les services de commandes
 */
import { OrderService } from '../application/OrderService';
import { SupabaseOrderRepository } from './supabaseOrderRepository';

// Singleton pour le repository des commandes
const orderRepository = new SupabaseOrderRepository();

// Singleton pour le service des commandes
const orderService = new OrderService(orderRepository);

export const getOrderService = (): OrderService => {
  return orderService;
};
