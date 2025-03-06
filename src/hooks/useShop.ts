
import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { Shop, ShopItem, ShopItemStatus, Order, OrderStatus } from '@/core/shop/domain/types';
import { ShopApiGateway } from '@/services/api-gateway/ShopApiGateway';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export const useShop = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const shopApiGateway = useMemo(() => new ShopApiGateway(), []);

  // Hook pour récupérer la boutique d'un utilisateur
  const useUserShop = () => {
    return useQuery({
      queryKey: ['userShop', user?.id],
      queryFn: async () => {
        if (!user?.id) return null;
        try {
          return await shopApiGateway.getUserShop(user.id);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les informations de votre boutique",
          });
          throw error;
        }
      },
      enabled: !!user?.id,
    });
  };

  // Hook pour récupérer une boutique par son ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('ID de boutique non fourni');
        try {
          return await shopApiGateway.getShopById(shopId);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les informations de la boutique",
          });
          throw error;
        }
      },
      enabled: !!shopId,
    });
  };

  // Mutation pour créer une boutique
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>) => {
        if (!user?.id) throw new Error('Utilisateur non connecté');
        return await shopApiGateway.createShop({ ...shopData, user_id: user.id });
      },
      meta: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['userShop'] });
          toast({
            title: "Succès",
            description: "Votre boutique a été créée avec succès",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Impossible de créer votre boutique",
          });
        }
      }
    });
  };

  // Mutation pour ajouter des articles à une boutique
  const useAddShopItems = () => {
    return useMutation({
      mutationFn: async ({ shopId, items }: { shopId: string, items: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>[] }) => {
        return await shopApiGateway.createShopItem(shopId, items);
      },
      meta: {
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: ['shopItems', variables.shopId] });
          toast({
            title: "Succès",
            description: "Articles ajoutés avec succès",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Impossible d'ajouter les articles",
          });
        }
      }
    });
  };

  // Mutation pour mettre à jour un article
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string, data: Partial<ShopItem> }) => {
        return await shopApiGateway.updateShop(id, data);
      },
      meta: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['shopItems'] });
          toast({
            title: "Succès",
            description: "Article mis à jour avec succès",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Impossible de mettre à jour l'article",
          });
        }
      }
    });
  };

  // Mutation pour mettre à jour le statut d'un article
  const useUpdateShopItemStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status }: { id: string, status: ShopItemStatus }) => {
        return await shopApiGateway.updateShopItemStatus(id, status);
      },
      meta: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['shopItems'] });
          toast({
            title: "Succès",
            description: "Statut de l'article mis à jour",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Impossible de mettre à jour le statut",
          });
        }
      }
    });
  };

  // Hook pour récupérer les articles d'une boutique
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('ID de boutique non fourni');
        return await shopApiGateway.getShopItemsById(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Hook pour récupérer un article par son ID
  const useShopItemById = (itemId?: string) => {
    return useQuery({
      queryKey: ['shopItem', itemId],
      queryFn: async () => {
        if (!itemId) throw new Error('ID d\'article non fourni');
        return await shopApiGateway.getShopItemById(itemId);
      },
      enabled: !!itemId,
    });
  };

  // Hook pour récupérer les commandes d'une boutique
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopOrders', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('ID de boutique non fourni');
        return await shopApiGateway.getOrdersForShop(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Mutation pour mettre à jour le statut d'une commande
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status }: { id: string, status: OrderStatus }) => {
        return await shopApiGateway.updateOrderStatus(id, status);
      },
      meta: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
          toast({
            title: "Succès",
            description: "Statut de la commande mis à jour",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Impossible de mettre à jour le statut",
          });
        }
      }
    });
  };

  // Hook pour vérifier si une boutique est dans les favoris
  const useIsShopFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['isFavorite', shopId, user?.id],
      queryFn: async () => {
        if (!shopId || !user?.id) return false;
        return await shopApiGateway.isShopFavorited(user.id, shopId);
      },
      enabled: !!shopId && !!user?.id,
    });
  };

  // Hook pour récupérer les boutiques favorites
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favoriteShops', user?.id],
      queryFn: async () => {
        if (!user?.id) return [];
        return await shopApiGateway.getFavoriteShops(user.id);
      },
      enabled: !!user?.id,
    });
  };

  // Mutation pour ajouter une boutique aux favoris
  const useFavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('Utilisateur non connecté');
        return await shopApiGateway.addShopToFavorites(user.id, shopId);
      },
      meta: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
          queryClient.invalidateQueries({ queryKey: ['favoriteShops'] });
          toast({
            title: "Succès",
            description: "Boutique ajoutée aux favoris",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Impossible d'ajouter aux favoris",
          });
        }
      }
    });
  };

  // Mutation pour retirer une boutique des favoris
  const useUnfavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('Utilisateur non connecté');
        return await shopApiGateway.removeShopFromFavorites(user.id, shopId);
      },
      meta: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
          queryClient.invalidateQueries({ queryKey: ['favoriteShops'] });
          toast({
            title: "Succès",
            description: "Boutique retirée des favoris",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Impossible de retirer des favoris",
          });
        }
      }
    });
  };

  // Créer un hook pour ajouter un nouvel article
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: async ({ shopId, item }: { shopId: string, item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'> }) => {
        // Assurer que l'item a bien un shop_id
        const itemWithShopId = {
          ...item,
          shop_id: shopId
        };
        return await shopApiGateway.createShopItem(shopId, [itemWithShopId]);
      },
      meta: {
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: ['shopItems', variables.shopId] });
          toast({
            title: "Succès",
            description: "Article ajouté avec succès",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Impossible d'ajouter l'article",
          });
        }
      }
    });
  };

  return {
    useShopById,
    useUserShop,
    useCreateShop,
    useShopItems,
    useShopItemById,
    useAddShopItems,
    useUpdateShopItem,
    useUpdateShopItemStatus,
    useShopOrders,
    useUpdateOrderStatus,
    useIsShopFavorited,
    useFavoriteShops,
    useFavoriteShop,
    useUnfavoriteShop,
    useCreateShopItem
  };
};
