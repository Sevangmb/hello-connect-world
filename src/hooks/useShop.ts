import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, ShopReview, Order } from '@/core/shop/domain/types';

// Interface pour les paramètres de création d'une review
interface CreateReviewParams {
  shopId: string;
  userId: string;
  rating: number;
  comment?: string;
}

export const useShop = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const shopService = getShopService();
  
  // Get current user's shop
  const {
    data: shop,
    isLoading: isShopLoading,
    error: shopError,
    refetch: refetchShop,
  } = useQuery({
    queryKey: ['userShop', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await shopService.getShopByUserId(user.id);
    },
    enabled: !!user?.id,
  });
  
  // Get shop by ID
  const getShopById = async (id: string) => {
    return await shopService.getShopById(id);
  };
  
  // Create a new shop
  const createShopMutation = useMutation({
    mutationFn: (shopData: Omit<Shop, "id" | "created_at" | "updated_at" | "average_rating">) => {
      return shopService.createShop(shopData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userShop'] });
    },
  });
  
  // Update a shop
  const updateShopMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      return shopService.updateShop(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userShop'] });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
  });
  
  // Get shop items
  const getShopItems = async (shopId: string) => {
    return await shopService.getShopItems(shopId);
  };
  
  // Create a shop item
  const createShopItemMutation = useMutation({
    mutationFn: (itemData: any) => {
      return shopService.createShopItem(itemData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
    },
  });
  
  // Update a shop item
  const updateShopItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      return shopService.updateShopItem(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
    },
  });
  
  // Delete a shop item
  const deleteShopItemMutation = useMutation({
    mutationFn: (id: string) => {
      return shopService.deleteShopItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
    },
  });
  
  // Get shop reviews
  const getShopReviews = async (shopId: string) => {
    return await shopService.getShopReviews(shopId);
  };
  
  // Create a shop review
  const createShopReviewMutation = useMutation({
    mutationFn: (reviewData: any) => {
      return shopService.createShopReview(reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopReviews'] });
    },
  });
  
  // Get shop orders
  const getShopOrders = async (shopId: string) => {
    return await shopService.getShopOrders(shopId);
  };
  
  // Get user orders
  const getUserOrders = async (userId: string) => {
    return await shopService.getUserOrders(userId);
  };
  
  // Update order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      return shopService.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    },
  });
  
  // Ajouter un avis sur une boutique
  const addShopReviewMutation = useMutation({
    mutationFn: async ({ shopId, userId, rating, comment }: CreateReviewParams) => {
      try {
        const review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'> = {
          shop_id: shopId,
          user_id: userId,
          rating,
          comment
        };
        
        // Utiliser directement l'interface IShopRepository plutôt que ShopService
        return await shopService.createShopReview(review);
      } catch (error) {
        console.error('Error adding shop review:', error);
        throw error;
      }
    },
    meta: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shop-reviews'] });
        toast({
          title: 'Avis ajouté',
          description: 'Votre avis a été ajouté avec succès',
          variant: 'default'
        });
      },
      onError: () => {
        toast({
          title: 'Erreur',
          description: 'Impossible d\'ajouter votre avis',
          variant: 'destructive'
        });
      }
    }
  });

  return {
    // Shop data
    shop,
    isShopLoading,
    shopError,
    refetchShop,
    
    // Shop CRUD
    getShopById,
    createShop: createShopMutation.mutate,
    isCreatingShop: createShopMutation.isPending,
    updateShop: updateShopMutation.mutate,
    isUpdatingShop: updateShopMutation.isPending,
    
    // Shop items
    getShopItems,
    createShopItem: createShopItemMutation.mutate,
    isCreatingShopItem: createShopItemMutation.isPending,
    updateShopItem: updateShopItemMutation.mutate,
    isUpdatingShopItem: updateShopItemMutation.isPending,
    deleteShopItem: deleteShopItemMutation.mutate,
    isDeletingShopItem: deleteShopItemMutation.isPending,
    
    // Shop reviews
    getShopReviews,
    createShopReview: createShopReviewMutation.mutate,
    isCreatingShopReview: createShopReviewMutation.isPending,
    addShopReview: addShopReviewMutation.mutate,
    
    // Shop orders
    getShopOrders,
    getUserOrders,
    updateOrderStatus: updateOrderStatusMutation.mutate,
    isUpdatingOrderStatus: updateOrderStatusMutation.isPending,
  };
};

export function useShopReviewMutation() {
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: async ({ shopId, userId, rating, comment }: CreateReviewParams) => {
      try {
        const shopService = getShopService();
        return await shopService.createShopReview({
          shop_id: shopId,
          user_id: userId,
          rating,
          comment
        });
      } catch (error) {
        console.error('Error creating review:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopReviews'] });
      toast({
        title: "Avis publié",
        description: "Votre avis a été publié avec succès.",
      });
    },
    onError: (error: Error) => {
      console.error('Shop review mutation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre avis. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  return {
    createReview
  };
}
