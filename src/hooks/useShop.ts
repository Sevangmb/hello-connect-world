
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopReview, Order, OrderStatus } from '@/core/shop/domain/types';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useShop = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const shopService = getShopService();

  // Get shop by ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        return await shopService.getShopById(shopId);
      },
      enabled: !!shopId
    });
  };

  // Get current user's shop
  const useUserShop = () => {
    return useQuery({
      queryKey: ['userShop', user?.id],
      queryFn: async () => {
        if (!user) throw new Error('User is not authenticated');
        return await shopService.getShopByUserId(user.id);
      },
      enabled: !!user
    });
  };

  // Create a shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>) => {
        if (!user) throw new Error('User is not authenticated');
        // Need to assign a default value for average_rating
        const shopDataWithRating = {
          ...shopData,
          average_rating: 0
        };
        return await shopService.createShop(shopDataWithRating);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
        toast({
          title: 'Boutique créée',
          description: 'Votre boutique a été créée avec succès',
        });
      },
      onError: (error) => {
        console.error('Error creating shop:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de créer la boutique',
        });
      }
    });
  };

  // Update a shop
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: async ({ id, ...data }: { id: string } & Partial<Shop>) => {
        return await shopService.updateShop(id, data);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['shop', data.id] });
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
        toast({
          title: 'Boutique mise à jour',
          description: 'Les informations de votre boutique ont été mises à jour',
        });
      },
      onError: (error) => {
        console.error('Error updating shop:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de mettre à jour la boutique',
        });
      }
    });
  };

  // Create a shop item
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: async (itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>) => {
        // Remove created_at if it exists in the data
        const { created_at, ...validItemData } = itemData as any;
        return await shopService.createShopItem(validItemData);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', data.shop_id] });
        toast({
          title: 'Article ajouté',
          description: 'L\'article a été ajouté à votre boutique',
        });
      },
      onError: (error) => {
        console.error('Error creating shop item:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible d\'ajouter l\'article',
        });
      }
    });
  };

  // Get shop items
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        return await shopService.getShopItems(shopId);
      },
      enabled: !!shopId
    });
  };

  // Update a shop item
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: async ({ id, ...data }: { id: string } & Partial<ShopItem>) => {
        return await shopService.updateShopItem(id, data);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', data.shop_id] });
        toast({
          title: 'Article mis à jour',
          description: 'L\'article a été mis à jour avec succès',
        });
      },
      onError: (error) => {
        console.error('Error updating shop item:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de mettre à jour l\'article',
        });
      }
    });
  };

  // Get shop orders
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopOrders', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        return await shopService.getOrders(shopId);
      },
      enabled: !!shopId
    });
  };

  // Get user orders
  const useUserOrders = () => {
    return useQuery({
      queryKey: ['userOrders', user?.id],
      queryFn: async () => {
        if (!user) throw new Error('User is not authenticated');
        return await shopService.getOrders(user.id);
      },
      enabled: !!user
    });
  };

  // Update order status
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ orderId, status }: { orderId: string, status: OrderStatus }) => {
        return await shopService.updateOrderStatus(orderId, status);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
        queryClient.invalidateQueries({ queryKey: ['userOrders'] });
        toast({
          title: 'Statut mis à jour',
          description: 'Le statut de la commande a été mis à jour',
        });
      },
      onError: (error) => {
        console.error('Error updating order status:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de mettre à jour le statut de la commande',
        });
      }
    });
  };

  // Get shop reviews
  const useShopReviews = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopReviews', shopId],
      queryFn: async () => {
        if (!shopId) throw new Error('Shop ID is required');
        return await shopService.getShopReviews(shopId);
      },
      enabled: !!shopId
    });
  };

  // Create a shop review
  const useCreateShopReview = () => {
    return useMutation({
      mutationFn: async (reviewData: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>) => {
        if (!user) throw new Error('User is not authenticated');
        // Remove id if it exists in the data
        const { id, ...validReviewData } = reviewData as any;
        return await shopService.createShopReview(validReviewData);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['shopReviews', data.shop_id] });
        toast({
          title: 'Avis ajouté',
          description: 'Votre avis a été ajouté avec succès',
        });
      },
      onError: (error) => {
        console.error('Error creating shop review:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible d\'ajouter votre avis',
        });
      }
    });
  };

  // Use favorite shops
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favoriteShops', user?.id],
      queryFn: async () => {
        if (!user) throw new Error('User is not authenticated');
        return await shopService.getUserFavoriteShops(user.id);
      },
      enabled: !!user
    });
  };

  // Add shop to favorites
  const useAddToFavorites = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user) throw new Error('User is not authenticated');
        return await shopService.addShopToFavorites(user.id, shopId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favoriteShops'] });
        toast({
          title: 'Boutique ajoutée aux favoris',
          description: 'La boutique a été ajoutée à vos favoris',
        });
      },
      onError: (error) => {
        console.error('Error adding shop to favorites:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible d\'ajouter la boutique aux favoris',
        });
      }
    });
  };

  // Remove shop from favorites
  const useRemoveFromFavorites = () => {
    return useMutation({
      mutationFn: async (shopId: string) => {
        if (!user) throw new Error('User is not authenticated');
        return await shopService.removeShopFromFavorites(user.id, shopId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favoriteShops'] });
        toast({
          title: 'Boutique retirée des favoris',
          description: 'La boutique a été retirée de vos favoris',
        });
      },
      onError: (error) => {
        console.error('Error removing shop from favorites:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de retirer la boutique des favoris',
        });
      }
    });
  };

  // Check if shop is favorited
  const useIsFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['isFavorited', shopId, user?.id],
      queryFn: async () => {
        if (!user || !shopId) return false;
        return await shopService.isShopFavorited(user.id, shopId);
      },
      enabled: !!user && !!shopId
    });
  };

  return {
    useShopById,
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useShopItems,
    useCreateShopItem,
    useUpdateShopItem,
    useShopOrders,
    useUserOrders,
    useUpdateOrderStatus,
    useShopReviews,
    useCreateShopReview,
    useFavoriteShops,
    useAddToFavorites,
    useRemoveFromFavorites,
    useIsFavorited,
  };
};
