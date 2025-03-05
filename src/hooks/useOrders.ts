
/**
 * Hook pour la gestion des commandes
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getOrderService } from "@/core/orders/infrastructure/orderDependencyProvider";
import { useAuth } from "@/hooks/useAuth";
import { OrderCreateRequest, OrderUpdateRequest } from "@/core/orders/domain/types";

export const useOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orderService = getOrderService();
  const { user } = useAuth();

  // Récupérer les commandes de l'utilisateur en tant qu'acheteur
  const { data: buyerOrders, isLoading: isLoadingBuyerOrders } = useQuery({
    queryKey: ['orders', 'buyer', user?.id],
    queryFn: async () => {
      if (!user?.id) return { orders: [], count: 0 };
      return await orderService.getBuyerOrders(user.id);
    },
    enabled: !!user?.id,
  });

  // Récupérer les commandes de l'utilisateur en tant que vendeur
  const { data: sellerOrders, isLoading: isLoadingSellerOrders } = useQuery({
    queryKey: ['orders', 'seller', user?.id],
    queryFn: async () => {
      if (!user?.id) return { orders: [], count: 0 };
      return await orderService.getSellerOrders(user.id);
    },
    enabled: !!user?.id,
  });

  // Récupérer une commande par son ID
  const useOrderDetails = (orderId?: string) => {
    return useQuery({
      queryKey: ['order', orderId],
      queryFn: async () => {
        if (!orderId) throw new Error("ID de commande requis");
        return await orderService.getOrderById(orderId);
      },
      enabled: !!orderId,
    });
  };

  // Création d'une commande
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderCreateRequest) => {
      if (!user?.id) throw new Error("Utilisateur non connecté");
      
      // S'assurer que l'ID de l'acheteur est celui de l'utilisateur connecté
      const orderDataWithBuyer = {
        ...orderData,
        buyerId: user.id,
      };
      
      const result = await orderService.createOrder(orderDataWithBuyer);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.order;
    },
    meta: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        toast({
          title: "Commande créée",
          description: "Votre commande a été créée avec succès",
        });
      },
      onError: (error: Error) => {
        console.error("Erreur lors de la création de la commande:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Impossible de créer la commande: ${error.message}`,
        });
      },
    },
  });

  // Mise à jour d'une commande
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: OrderUpdateRequest }) => {
      if (!orderId) throw new Error("ID de commande requis");
      
      const result = await orderService.updateOrder(orderId, data);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.order;
    },
    meta: {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
        toast({
          title: "Commande mise à jour",
          description: "La commande a été mise à jour avec succès",
        });
      },
      onError: (error: Error) => {
        console.error("Erreur lors de la mise à jour de la commande:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Impossible de mettre à jour la commande: ${error.message}`,
        });
      },
    },
  });

  // Traitement du paiement d'une commande
  const processPaymentMutation = useMutation({
    mutationFn: async ({ orderId, paymentMethod }: { orderId: string; paymentMethod: string }) => {
      if (!orderId) throw new Error("ID de commande requis");
      
      const result = await orderService.processOrderPayment(orderId, paymentMethod);
      
      if (!result.success) {
        throw new Error(result.error || "Échec du traitement du paiement");
      }
      
      return true;
    },
    meta: {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
        toast({
          title: "Paiement traité",
          description: "Le paiement a été traité avec succès",
        });
      },
      onError: (error: Error) => {
        console.error("Erreur lors du traitement du paiement:", error);
        toast({
          variant: "destructive",
          title: "Erreur de paiement",
          description: `Impossible de traiter le paiement: ${error.message}`,
        });
      },
    },
  });

  return {
    // Queries
    buyerOrders: buyerOrders?.orders || [],
    sellerOrders: sellerOrders?.orders || [],
    isLoadingBuyerOrders,
    isLoadingSellerOrders,
    buyerOrdersCount: buyerOrders?.count || 0,
    sellerOrdersCount: sellerOrders?.count || 0,
    
    // Mutations
    createOrder: createOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    processPayment: processPaymentMutation.mutate,
    
    // États des mutations
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isProcessingPayment: processPaymentMutation.isPending,
    
    // Hooks
    useOrderDetails,
  };
};
