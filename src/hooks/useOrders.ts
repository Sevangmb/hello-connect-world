
/**
 * Hook pour utiliser le service de commandes
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getOrderService } from '@/core/orders/infrastructure/orderDependencyProvider';
import { 
  Order, 
  OrderItem, 
  CreateOrderParams, 
  OrderFilter 
} from '@/core/orders/domain/types';
import { useToast } from './use-toast';

export const useOrders = () => {
  const [buyerOrders, setBuyerOrders] = useState<Order[]>([]);
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const orderService = getOrderService();
  
  // Charger les commandes de l'acheteur
  const loadBuyerOrders = useCallback(async (filter?: OrderFilter) => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const orders = await orderService.getBuyerOrders(user.id, filter);
      setBuyerOrders(orders);
    } catch (err) {
      setError('Erreur lors du chargement de vos commandes');
      console.error('Erreur dans loadBuyerOrders:', err);
    } finally {
      setLoading(false);
    }
  }, [user, orderService]);
  
  // Charger les commandes du vendeur
  const loadSellerOrders = useCallback(async (filter?: OrderFilter) => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const orders = await orderService.getSellerOrders(user.id, filter);
      setSellerOrders(orders);
    } catch (err) {
      setError('Erreur lors du chargement des commandes de vente');
      console.error('Erreur dans loadSellerOrders:', err);
    } finally {
      setLoading(false);
    }
  }, [user, orderService]);
  
  // Charger une commande spécifique
  const loadOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const order = await orderService.getOrderById(orderId);
      setCurrentOrder(order);
      
      if (!order) {
        setError('Commande non trouvée');
      }
      
      return order;
    } catch (err) {
      setError('Erreur lors du chargement de la commande');
      console.error('Erreur dans loadOrder:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [orderService]);
  
  // Créer une nouvelle commande
  const createOrder = useCallback(async (params: Omit<CreateOrderParams, 'buyerId'>) => {
    if (!user?.id) {
      setError('Vous devez être connecté pour passer une commande');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const orderParams: CreateOrderParams = {
        ...params,
        buyerId: user.id
      };
      
      const order = await orderService.createOrder(orderParams);
      
      if (order) {
        toast({
          title: 'Commande créée',
          description: `Votre commande #${order.id.substring(0, 8)} a été créée avec succès.`,
        });
        
        // Rafraîchir la liste des commandes
        loadBuyerOrders();
      } else {
        setError('Erreur lors de la création de la commande');
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'La commande n\'a pas pu être créée.',
        });
      }
      
      return order;
    } catch (err) {
      setError('Erreur lors de la création de la commande');
      console.error('Erreur dans createOrder:', err);
      
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création de la commande.',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, orderService, loadBuyerOrders, toast]);
  
  // Traiter un paiement
  const processPayment = useCallback(async (orderId: string, paymentMethodId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await orderService.processPayment(orderId, paymentMethodId);
      
      if (success) {
        toast({
          title: 'Paiement traité',
          description: 'Votre paiement a été traité avec succès.',
        });
        
        // Rafraîchir la commande actuelle
        loadOrder(orderId);
        
        // Rafraîchir les listes de commandes
        loadBuyerOrders();
      } else {
        setError('Erreur lors du traitement du paiement');
        toast({
          variant: 'destructive',
          title: 'Erreur de paiement',
          description: 'Le paiement n\'a pas pu être traité.',
        });
      }
      
      return success;
    } catch (err) {
      setError('Erreur lors du traitement du paiement');
      console.error('Erreur dans processPayment:', err);
      
      toast({
        variant: 'destructive',
        title: 'Erreur de paiement',
        description: 'Une erreur est survenue lors du traitement du paiement.',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [orderService, loadOrder, loadBuyerOrders, toast]);
  
  // Annuler une commande
  const cancelOrder = useCallback(async (orderId: string, reason?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await orderService.cancelOrder(orderId, reason);
      
      if (success) {
        toast({
          title: 'Commande annulée',
          description: 'Votre commande a été annulée avec succès.',
        });
        
        // Rafraîchir la commande actuelle
        loadOrder(orderId);
        
        // Rafraîchir les listes de commandes
        loadBuyerOrders();
        loadSellerOrders();
      } else {
        setError('Erreur lors de l\'annulation de la commande');
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'La commande n\'a pas pu être annulée.',
        });
      }
      
      return success;
    } catch (err) {
      setError('Erreur lors de l\'annulation de la commande');
      console.error('Erreur dans cancelOrder:', err);
      
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'annulation de la commande.',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [orderService, loadOrder, loadBuyerOrders, loadSellerOrders, toast]);
  
  // Mettre à jour le statut d'une commande
  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await orderService.updateOrderStatus(orderId, status);
      
      if (success) {
        toast({
          title: 'Statut mis à jour',
          description: `Le statut de la commande a été mis à jour: ${status}`,
        });
        
        // Rafraîchir la commande actuelle
        loadOrder(orderId);
        
        // Rafraîchir les listes de commandes
        loadBuyerOrders();
        loadSellerOrders();
      } else {
        setError('Erreur lors de la mise à jour du statut');
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Le statut n\'a pas pu être mis à jour.',
        });
      }
      
      return success;
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error('Erreur dans updateOrderStatus:', err);
      
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour du statut.',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [orderService, loadOrder, loadBuyerOrders, loadSellerOrders, toast]);
  
  // Charger les commandes au chargement si l'utilisateur est connecté
  useEffect(() => {
    if (user?.id) {
      loadBuyerOrders();
      loadSellerOrders();
    }
  }, [user, loadBuyerOrders, loadSellerOrders]);
  
  return {
    // États
    buyerOrders,
    sellerOrders,
    currentOrder,
    loading,
    error,
    
    // Actions
    loadBuyerOrders,
    loadSellerOrders,
    loadOrder,
    createOrder,
    processPayment,
    cancelOrder,
    updateOrderStatus
  };
};
