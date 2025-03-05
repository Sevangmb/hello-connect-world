
/**
 * Fournisseur de dépendances pour le service de commandes
 */
import { OrderService } from '../application/OrderService';
import { SupabaseOrderRepository } from './supabaseOrderRepository';

// Singleton pour le repository
let orderRepository: SupabaseOrderRepository | null = null;

// Singleton pour le service
let orderService: OrderService | null = null;

/**
 * Fournit une instance du repository de commandes
 */
export function getOrderRepository(): SupabaseOrderRepository {
  if (!orderRepository) {
    orderRepository = new SupabaseOrderRepository();
  }
  return orderRepository;
}

/**
 * Fournit une instance du service de commandes
 */
export function getOrderService(): OrderService {
  if (!orderService) {
    const repository = getOrderRepository();
    orderService = new OrderService(repository);
  }
  return orderService;
}
