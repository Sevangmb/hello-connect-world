
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShopService } from '@/core/shop/application/ShopService';
import { ShopRepository } from '@/core/shop/infrastructure/ShopRepository';
import { Shop, ShopItem, ShopSettings, ShopReview, Order, OrderStatus, CartItem } from '@/core/shop/domain/types';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

// Create a service instance
const shopRepository = new ShopRepository();
const shopService = new ShopService(shopRepository);

export const useShop = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get shop by ID
  const useShopById = (shopId?: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: () => shopService.getShopById(shopId || ''),
      enabled: !!shopId,
    });
  };

  // Get current user's shop
  const useUserShop = () => {
    return useQuery({
      queryKey: ['userShop', user?.id],
      queryFn: () => shopService.getShopByUserId(user?.id || ''),
      enabled: !!user?.id,
    });
  };

  // Create a shop
  const useCreateShop = () => {
    return useMutation({
      mutationFn: (shopData: Partial<Shop>) => shopService.createShop(shopData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      },
    });
  };

  // Update a shop
  const useUpdateShop = () => {
    return useMutation({
      mutationFn: ({ id, shopData }: { id: string; shopData: Partial<Shop> }) => 
        shopService.updateShop(id, shopData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shop', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['userShop'] });
        queryClient.invalidateQueries({ queryKey: ['shops'] });
      },
    });
  };

  // Get all shops
  const useAllShops = () => {
    return useQuery({
      queryKey: ['shops'],
      queryFn: () => shopService.getShopsByStatus('approved'),
    });
  };

  // Get shop items
  const useShopItems = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopItems', shopId],
      queryFn: () => shopService.getShopItemsByShopId(shopId || ''),
      enabled: !!shopId,
    });
  };

  // Get single shop item
  const useShopItem = (itemId?: string) => {
    return useQuery({
      queryKey: ['shopItem', itemId],
      queryFn: () => shopService.getShopItemById(itemId || ''),
      enabled: !!itemId,
    });
  };

  // Create shop item
  const useCreateShopItem = () => {
    return useMutation({
      mutationFn: (itemData: Partial<ShopItem>) => shopService.createShopItem(itemData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopItems', variables.shop_id] });
      },
    });
  };

  // Add multiple shop items
  const useAddShopItems = () => {
    return useMutation({
      mutationFn: (items: Partial<ShopItem>[]) => shopService.addShopItems(items),
      onSuccess: (_, variables) => {
        if (variables.length > 0 && variables[0].shop_id) {
          queryClient.invalidateQueries({ queryKey: ['shopItems', variables[0].shop_id] });
        }
      },
    });
  };

  // Update shop item
  const useUpdateShopItem = () => {
    return useMutation({
      mutationFn: ({ id, itemData }: { id: string; itemData: Partial<ShopItem> }) => 
        shopService.updateShopItem(id, itemData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopItem', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      },
    });
  };

  // Delete shop item
  const useDeleteShopItem = () => {
    return useMutation({
      mutationFn: (id: string) => shopService.deleteShopItem(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      },
    });
  };

  // Get shop reviews
  const useShopReviews = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopReviews', shopId],
      queryFn: () => shopService.getShopReviews(shopId || ''),
      enabled: !!shopId,
    });
  };

  // Create shop review
  const useCreateShopReview = () => {
    return useMutation({
      mutationFn: (reviewData: Partial<ShopReview>) => shopService.createShopReview(reviewData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopReviews', variables.shop_id] });
        queryClient.invalidateQueries({ queryKey: ['shop', variables.shop_id] });
      },
    });
  };

  // Get shop settings
  const useGetShopSettings = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopSettings', shopId],
      queryFn: () => shopService.getShopSettings(shopId || ''),
      enabled: !!shopId,
    });
  };

  // Update shop settings
  const useUpdateShopSettings = () => {
    return useMutation({
      mutationFn: ({ shopId, settingsData }: { shopId: string; settingsData: Partial<ShopSettings> }) => 
        shopService.updateShopSettings(shopId, settingsData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopSettings', variables.shopId] });
      },
    });
  };

  // Get shop orders
  const useShopOrders = (shopId?: string) => {
    return useQuery({
      queryKey: ['shopOrders', shopId],
      queryFn: () => shopService.getShopOrders(shopId || ''),
      enabled: !!shopId,
    });
  };

  // Create order
  const useCreateOrder = () => {
    return useMutation({
      mutationFn: (orderData: Partial<Order>) => shopService.createOrder(orderData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['shopOrders', variables.shop_id] });
      },
    });
  };

  // Update order status
  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) => 
        shopService.updateOrderStatus(orderId, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shopOrders'] });
      },
    });
  };

  // Get favorite shops
  const useFavoriteShops = () => {
    return useQuery({
      queryKey: ['favoriteShops', user?.id],
      queryFn: () => shopService.getFavoriteShops(user?.id || ''),
      enabled: !!user?.id,
    });
  };

  // Check if shop is favorited
  const useIsShopFavorited = (shopId?: string) => {
    return useQuery({
      queryKey: ['isShopFavorited', user?.id, shopId],
      queryFn: () => shopService.isShopFavorited(user?.id || '', shopId || ''),
      enabled: !!user?.id && !!shopId,
    });
  };

  // Add shop to favorites
  const useAddShopToFavorites = () => {
    return useMutation({
      mutationFn: (shopId: string) => shopService.addShopToFavorites(user?.id || '', shopId),
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['favoriteShops'] });
        queryClient.invalidateQueries({ queryKey: ['isShopFavorited', user?.id, shopId] });
      },
    });
  };

  // Remove shop from favorites
  const useRemoveShopFromFavorites = () => {
    return useMutation({
      mutationFn: (shopId: string) => shopService.removeShopFromFavorites(user?.id || '', shopId),
      onSuccess: (_, shopId) => {
        queryClient.invalidateQueries({ queryKey: ['favoriteShops'] });
        queryClient.invalidateQueries({ queryKey: ['isShopFavorited', user?.id, shopId] });
      },
    });
  };

  // Add to cart
  const useAddToCart = () => {
    return useMutation({
      mutationFn: ({ itemId, shopId, quantity }: { itemId: string; shopId: string; quantity: number }) => 
        shopService.addToCart(user?.id || '', itemId, shopId, quantity),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      },
    });
  };

  return {
    useShopById,
    useUserShop,
    useCreateShop,
    useUpdateShop,
    useAllShops,
    useShopItems,
    useShopItem,
    useCreateShopItem,
    useAddShopItems,
    useUpdateShopItem,
    useDeleteShopItem,
    useShopReviews,
    useCreateShopReview,
    useGetShopSettings,
    useUpdateShopSettings,
    useShopOrders,
    useCreateOrder,
    useUpdateOrderStatus,
    useFavoriteShops,
    useIsShopFavorited,
    useAddShopToFavorites,
    useRemoveShopFromFavorites,
    useAddToCart
  };
};
