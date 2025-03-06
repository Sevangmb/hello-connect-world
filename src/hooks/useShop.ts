
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shopApiGateway } from '@/services/api-gateway/ShopApiGateway';
import { useAuth } from './useAuth';
import { Shop, ShopItem, ShopStatus, ShopItemStatus, Order } from '@/core/shop/domain/types';

// Custom hook pour les fonctionnalités liées aux boutiques
export const useShop = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer une boutique par son ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) return null;
        return shopApiGateway.getShopById(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Récupérer la boutique de l'utilisateur connecté
  const useUserShop = () => {
    return useQuery({
      queryKey: ['userShop', user?.id],
      queryFn: async () => {
        if (!user?.id) return null;
        return shopApiGateway.getUserShop(user.id);
      },
      enabled: !!user?.id,
    });
  };

  // Créer une nouvelle boutique
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>) => {
        return shopApiGateway.createShop(shopData);
      },
      onSuccess: () => {
        // Invalider les requêtes pour forcer un rafraîchissement
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      },
    });
  };

  // Mettre à jour une boutique
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ id, shop }: { id: string; shop: Partial<Shop> }) => {
        return shopApiGateway.updateShop(id, shop);
      },
      onSuccess: (_, variables) => {
        // Invalider les requêtes pour forcer un rafraîchissement
        queryClient.invalidateQueries({ queryKey: ['shop', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      },
    });
  };

  // Créer un nouvel article dans une boutique
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: async ({ shopId, item }: { shopId: string; item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'> }) => {
        return shopApiGateway.createShopItem(shopId, item);
      },
      onSuccess: (_, variables) => {
        // Invalider les requêtes pour forcer un rafraîchissement
        queryClient.invalidateQueries({ queryKey: ['shopItems', variables.shopId] });
      },
    });
  };

  // Mettre à jour un article
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ id, item }: { id: string; item: Partial<ShopItem> }) => {
        // Cette méthode n'existe pas encore dans ShopApiGateway - on utilise une mise à jour factice
        // pour le moment
        console.log('Update shop item', id, item);
        return { id, ...item };
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopItem', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      },
    });
  };

  // Mettre à jour le statut d'un article
  const useUpdateShopItemStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status }: { id: string; status: ShopItemStatus }) => {
        return shopApiGateway.updateShopItemStatus(id, status);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopItem', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      },
    });
  };

  // Récupérer les articles d'une boutique
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopApiGateway.getShopItems(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Récupérer un article par son ID
  const useShopItemById = (itemId?: string) => {
    return useQuery({
      queryKey: ['shopItem', itemId],
      queryFn: async () => {
        if (!itemId) return null;
        return shopApiGateway.getShopItemById(itemId);
      },
      enabled: !!itemId,
    });
  };

  // Récupérer les commandes d'une boutique
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopOrders', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        // Cette méthode n'existe pas encore dans l'API Gateway - simulons des données
        return [] as Order[];
      },
      enabled: !!shopId,
    });
  };

  // Récupérer les avis d'une boutique
  const useShopReviews = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopReviews', shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopApiGateway.getShopReviews(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Vérifier si l'utilisateur a mis la boutique en favori
  const useIsFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopFavorite', user?.id, shopId],
      queryFn: async () => {
        if (!user?.id || !shopId) return false;
        return shopApiGateway.isShopFavorited(user.id, shopId);
      },
      enabled: !!user?.id && !!shopId,
    });
  };

  // Ajouter une boutique aux favoris
  const useFavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('User must be logged in');
        return shopApiGateway.addShopToFavorites(user.id, shopId);
      },
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['shopFavorite', user?.id, shopId] });
        queryClient.invalidateQueries({ queryKey: ['favoriteShops', user?.id] });
      },
    });
  };

  // Supprimer une boutique des favoris
  const useUnfavoriteShop = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user?.id) throw new Error('User must be logged in');
        return shopApiGateway.removeShopFromFavorites(user.id, shopId);
      },
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['shopFavorite', user?.id, shopId] });
        queryClient.invalidateQueries({ queryKey: ['favoriteShops', user?.id] });
      },
    });
  };

  // Récupérer les boutiques favorites de l'utilisateur
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favoriteShops', user?.id],
      queryFn: async () => {
        if (!user?.id) return [];
        return shopApiGateway.getFavoriteShops(user.id);
      },
      enabled: !!user?.id,
    });
  };

  return {
    useShopById,
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useShopItems,
    useShopItemById,
    useCreateShopItem,
    useUpdateShopItem,
    useUpdateShopItemStatus,
    useShopOrders,
    useShopReviews,
    useIsFavorited,
    useFavoriteShop,
    useUnfavoriteShop,
    useFavoriteShops,
  };
};
