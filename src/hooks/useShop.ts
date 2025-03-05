
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, ShopReview, Order, OrderStatus } from '@/core/shop/domain/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Paramètres pour la création d'une boutique
interface CreateShopParams {
  name: string;
  description: string;
  image_url?: string;
  categories?: string[];
}

// Paramètres pour l'ajout d'un article
interface CreateShopItemParams {
  shop_id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
}

// Paramètres pour la création d'un avis
interface CreateReviewParams {
  shop_id: string;
  rating: number;
  comment?: string;
}

export const useShop = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const shopService = getShopService();

  // Récupérer une boutique par son ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        return shopService.getShopById(shopId);
      },
      enabled: !!shopId
    });
  };

  // Récupérer la boutique de l'utilisateur connecté
  const useUserShop = () => {
    return useQuery({
      queryKey: ['userShop', user?.id],
      queryFn: async () => {
        if (!user?.id) return null;
        return shopService.getShopByUserId(user.id);
      },
      enabled: !!user?.id
    });
  };

  // Créer une boutique
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (params: CreateShopParams) => {
        if (!user?.id) throw new Error('User not logged in');
        return shopService.createShop({
          ...params,
          user_id: user.id,
          status: 'pending',
          average_rating: 0,
          created_at: '',
          updated_at: '',
          id: ''
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userShop', user?.id] });
      }
    });
  };

  // Mettre à jour une boutique
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ shopId, data }: { shopId: string; data: Partial<Shop> }) => {
        return shopService.updateShop(shopId, data);
      },
      onSuccess: (updatedShop) => {
        queryClient.invalidateQueries({ queryKey: ['shop', updatedShop.id] });
        queryClient.invalidateQueries({ queryKey: ['userShop', user?.id] });
      }
    });
  };

  // Récupérer les articles d'une boutique
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopService.getShopItems(shopId);
      },
      enabled: !!shopId
    });
  };

  // Ajouter un article à une boutique
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: async (params: CreateShopItemParams) => {
        return shopService.createShopItem({
          ...params,
          original_price: params.price,
          status: 'available',
          created_at: '',
          updated_at: '',
          id: ''
        });
      },
      onSuccess: (newItem) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', newItem.shop_id] });
      }
    });
  };

  // Mettre à jour un article
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ itemId, data }: { itemId: string; data: Partial<ShopItem> }) => {
        return shopService.updateShopItem(itemId, data);
      },
      onSuccess: (updatedItem) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', updatedItem.shop_id] });
      }
    });
  };

  // Supprimer un article
  const useDeleteShopItem = () => {
    return useMutation({
      mutationFn: async (itemId: string) => {
        return shopService.deleteShopItem(itemId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      }
    });
  };

  // Récupérer les commandes d'une boutique
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopOrders', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopService.getOrders(shopId);
      },
      enabled: !!shopId
    });
  };

  // Récupérer les commandes d'un utilisateur
  const useUserOrders = () => {
    return useQuery({
      queryKey: ['userOrders', user?.id],
      queryFn: async () => {
        if (!user?.id) return [];
        return shopService.getOrders(user.id);
      },
      enabled: !!user?.id
    });
  };

  // Mettre à jour le statut d'une commande
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
        return shopService.updateOrder(orderId, { status });
      },
      onSuccess: (updatedOrder) => {
        queryClient.invalidateQueries({ queryKey: ['shopOrders', updatedOrder.shop_id] });
        queryClient.invalidateQueries({ queryKey: ['userOrders', user?.id] });
      }
    });
  };

  // Récupérer les avis d'une boutique
  const useShopReviews = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopReviews', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopService.getShopReviews(shopId);
      },
      enabled: !!shopId
    });
  };

  // Ajouter un avis
  const useCreateReview = () => {
    return useMutation({
      mutationFn: async ({ shop_id, rating, comment }: CreateReviewParams) => {
        if (!user?.id) throw new Error('User not logged in');
        return shopService.createShopReview({
          shop_id,
          user_id: user.id,
          rating,
          comment,
          id: '',
          created_at: '',
          updated_at: ''
        });
      },
      onSuccess: (newReview) => {
        queryClient.invalidateQueries({ queryKey: ['shopReviews', newReview.shop_id] });
        queryClient.invalidateQueries({ queryKey: ['shop', newReview.shop_id] });
        toast.success('Votre avis a été ajouté avec succès !');
      },
      onError: (error) => {
        toast.error(`Erreur lors de l'ajout de l'avis: ${(error as Error).message}`);
      }
    });
  };

  // Vérifier si une boutique est dans les favoris
  const useIsFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['isFavorited', shopId, user?.id],
      queryFn: async () => {
        if (!user?.id || !shopId) return false;
        return shopService.isShopFavorited(user.id, shopId);
      },
      enabled: !!shopId && !!user?.id
    });
  };

  // Ajouter une boutique aux favoris
  const useAddToFavorites = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('User not logged in');
        return shopService.addShopToFavorites(user.id, shopId);
      },
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['isFavorited', shopId, user?.id] });
        queryClient.invalidateQueries({ queryKey: ['favoriteShops', user?.id] });
        toast.success('Boutique ajoutée aux favoris !');
      },
      onError: (error) => {
        toast.error(`Erreur: ${(error as Error).message}`);
      }
    });
  };

  // Retirer une boutique des favoris
  const useRemoveFromFavorites = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('User not logged in');
        return shopService.removeShopFromFavorites(user.id, shopId);
      },
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['isFavorited', shopId, user?.id] });
        queryClient.invalidateQueries({ queryKey: ['favoriteShops', user?.id] });
      }
    });
  };

  // Récupérer les boutiques favorites
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favoriteShops', user?.id],
      queryFn: async () => {
        if (!user?.id) return [];
        return shopService.getUserFavoriteShops(user.id);
      },
      enabled: !!user?.id
    });
  };

  return {
    // Boutiques
    useShopById,
    useUserShop,
    useCreateShop,
    useUpdateShop,
    
    // Articles
    useShopItems,
    useCreateShopItem,
    useUpdateShopItem,
    useDeleteShopItem,
    
    // Commandes
    useShopOrders,
    useUserOrders,
    useUpdateOrderStatus,
    
    // Avis
    useShopReviews,
    useCreateReview,
    
    // Favoris
    useIsFavorited,
    useAddToFavorites,
    useRemoveFromFavorites,
    useFavoriteShops
  };
};
