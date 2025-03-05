
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { OrderStatus, ShopStatus } from '@/core/shop/domain/types';

export const useShop = () => {
  const shopService = getShopService();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getUserShop = async () => {
    try {
      return await shopService.getUserShop();
    } catch (error) {
      console.error('Error fetching user shop:', error);
      throw error;
    }
  };

  const { data: shop, isLoading: isShopLoading, refetch: refetchShop } = useQuery({
    queryKey: ['userShop'],
    queryFn: getUserShop,
    retry: false,
    enabled: true,
  });

  // Create shop
  const createShop = useMutation({
    mutationFn: async (shopData: any) => {
      try {
        return await shopService.createShop(shopData);
      } catch (error) {
        console.error('Error creating shop:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userShop'] });
      toast({
        title: 'Boutique créée',
        description: 'Votre boutique a été créée avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
      });
    },
  });

  // Update shop
  const updateShop = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        return await shopService.updateShop(id, data);
      } catch (error) {
        console.error('Error updating shop:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userShop'] });
      toast({
        title: 'Boutique mise à jour',
        description: 'Votre boutique a été mise à jour avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
      });
    },
  });

  // Add shop item
  const addShopItem = useMutation({
    mutationFn: async ({ shopId, itemData }: { shopId: string; itemData: any }) => {
      try {
        return await shopService.createShopItem({ ...itemData, shop_id: shopId });
      } catch (error) {
        console.error('Error adding shop item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      toast({
        title: 'Article ajouté',
        description: 'Votre article a été ajouté avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
      });
    },
  });

  // Update shop order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      try {
        return await shopService.updateOrderStatus(orderId, status);
      } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
      toast({
        title: 'Commande mise à jour',
        description: 'Le statut de la commande a été mis à jour avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
      });
    },
  });

  // Add shop review
  const addShopReview = useMutation({
    mutationFn: async ({ shopId, reviewData }: { shopId: string; reviewData: any }) => {
      try {
        return await shopService.addShopReview({ ...reviewData, shop_id: shopId });
      } catch (error) {
        console.error('Error adding shop review:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopReviews'] });
      toast({
        title: 'Avis ajouté',
        description: 'Votre avis a été ajouté avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
      });
    },
  });

  const getShopOrders = async (shopId: string) => {
    try {
      return await shopService.getShopOrders(shopId);
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      throw error;
    }
  };

  const getShopItems = async (shopId: string) => {
    try {
      return await shopService.getShopItems(shopId);
    } catch (error) {
      console.error('Error fetching shop items:', error);
      throw error;
    }
  };

  const getShopReviews = async (shopId: string) => {
    try {
      return await shopService.getShopReviews(shopId);
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      throw error;
    }
  };

  return {
    shop,
    isShopLoading,
    refetchShop,
    createShop: createShop.mutate,
    isCreatingShop: createShop.isPending,
    updateShop: updateShop.mutate,
    isUpdatingShop: updateShop.isPending,
    addShopItem: addShopItem.mutate,
    isAddingShopItem: addShopItem.isPending,
    updateOrderStatus: updateOrderStatus.mutate,
    isUpdatingOrderStatus: updateOrderStatus.isPending,
    addShopReview: addShopReview.mutate,
    isAddingShopReview: addShopReview.isPending,
    getShopOrders,
    getShopItems,
    getShopReviews,
  };
};

export default useShop;
