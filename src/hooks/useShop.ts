import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Shop, ShopItem, ShopItemStatus, ShopSettings } from '@/core/shop/domain/types';
import { useToast } from './use-toast';

export function useShop() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer la boutique de l'utilisateur actuel
  const {
    data: shop,
    isLoading: isShopLoading,
    refetch: refetchShop
  } = useQuery({
    queryKey: ['user-shop', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return ShopService.getUserShop(user.id);
    },
    enabled: !!user?.id,
  });

  // Déterminer si l'utilisateur actuel est le propriétaire de la boutique
  const isCurrentUserShopOwner = !!shop && shop.user_id === user?.id;

  // Créer une boutique
  const createShop = useMutation({
    mutationFn: async (data: { name: string; description: string; image_url?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return ShopService.createShop({
        user_id: user.id,
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        status: 'pending',
        average_rating: 0
      });
    },
    onSuccess: () => {
      toast({
        title: 'Boutique créée',
        description: 'Votre boutique a été créée avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['user-shop'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la boutique: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Mettre à jour une boutique
  const updateShop = useMutation({
    mutationFn: async (data: { id: string; name?: string; description?: string; image_url?: string }) => {
      return ShopService.updateShop(data.id, {
        name: data.name,
        description: data.description,
        image_url: data.image_url,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Boutique mise à jour',
        description: 'Les informations de votre boutique ont été mises à jour',
      });
      queryClient.invalidateQueries({ queryKey: ['user-shop'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la boutique: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Mettre à jour le statut d'une boutique
  const updateShopStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return ShopService.updateShopStatus(id, status as any);
    },
    onSuccess: () => {
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut de la boutique a été mis à jour',
      });
      queryClient.invalidateQueries({ queryKey: ['user-shop'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Récupérer les articles d'une boutique
  const getShopItems = useCallback(async (shopId: string) => {
    if (!shopId) return [];
    try {
      const items = await ShopService.getShopItems(shopId);
      return items;
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }, []);

  // Créer un article
  const createShopItem = useMutation({
    mutationFn: async (item: Omit<ShopItem, "id" | "created_at" | "updated_at">) => {
      if (!item.shop_id) throw new Error('Shop ID is required');
      return ShopService.createShopItem(item);
    },
    onSuccess: () => {
      toast({
        title: 'Article créé',
        description: 'L\'article a été ajouté à votre boutique',
      });
      queryClient.invalidateQueries({ queryKey: ['shop-items'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'article: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Mettre à jour un article
  const updateShopItem = useMutation({
    mutationFn: async (data: { id: string; item: Partial<ShopItem> }) => {
      return ShopService.updateShopItem(data.id, data.item);
    },
    onSuccess: () => {
      toast({
        title: 'Article mis à jour',
        description: 'L\'article a été mis à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['shop-items'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'article: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Mettre à jour le statut d'un article
  const updateShopItemStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ShopItemStatus }) => {
      return ShopService.updateShopItemStatus(id, status);
    },
    onSuccess: () => {
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut de l\'article a été mis à jour',
      });
      queryClient.invalidateQueries({ queryKey: ['shop-items'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Supprimer un article
  const removeShopItem = useMutation({
    mutationFn: async (id: string) => {
      return ShopService.deleteShopItem(id);
    },
    onSuccess: () => {
      toast({
        title: 'Article supprimé',
        description: 'L\'article a été supprimé de votre boutique',
      });
      queryClient.invalidateQueries({ queryKey: ['shop-items'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Récupérer les commandes d'une boutique
  const getShopOrders = useCallback(async (shopId: string) => {
    if (!shopId) return [];
    try {
      const orders = await ShopService.getShopOrders(shopId);
      return orders;
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }, []);

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      try {
        const success = await shopService.updateOrderStatus(id, status as string);
        if (success) {
          await queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
        }
        return success;
      } catch (error) {
        console.error("Error updating order status:", error);
        return false;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Commande mise à jour',
        description: 'Le statut de la commande a été mis à jour',
      });
      queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la commande: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Récupérer les paramètres de la boutique
  const getShopSettings = useCallback(async (shopId: string) => {
    if (!shopId) return null;
    try {
      const settings = await ShopService.getShopSettings(shopId);
      return settings;
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }, []);

  // Mettre à jour les paramètres de la boutique
  const updateShopSettings = useMutation({
    mutationFn: async (data: { id: string; settings: Partial<ShopSettings> }) => {
      return ShopService.updateShopSettings(data.id, data.settings);
    },
    onSuccess: () => {
      toast({
        title: 'Paramètres mis à jour',
        description: 'Les paramètres de votre boutique ont été mis à jour',
      });
      queryClient.invalidateQueries({ queryKey: ['shop-settings'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les paramètres: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  // Récupérer les avis sur une boutique
  const getShopReviews = useCallback(async (shopId: string) => {
    if (!shopId) return [];
    try {
      const reviews = await ShopService.getShopReviews(shopId);
      return reviews;
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }, []);

  return {
    // Données
    shop,
    isShopLoading,
    refetchShop,
    isCurrentUserShopOwner,

    // Mutations
    createShop,
    updateShop,
    updateShopStatus,
    createShopItem,
    updateShopItem,
    updateShopItemStatus,
    removeShopItem,
    updateOrderStatus,
    updateShopSettings,

    // Fonctions
    getShopItems,
    getShopOrders,
    getShopSettings,
    getShopReviews
  };
}
