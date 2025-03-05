
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export type CartItem = {
  id: string;
  user_id: string;
  shop_id: string;
  item_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  shop_items: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    shop_id: string;
  };
  shop: {
    id: string;
    name: string;
  };
};

export type AddToCartParams = {
  user_id: string;
  item_id: string;
  quantity: number;
};

export type UpdateQuantityParams = {
  cartItemId: string;
  quantity: number;
};

export const useCart = (userId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les articles du panier
  const {
    data: cartItems,
    isLoading: isCartLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items (*),
          shop:shop_id (id, name)
        `)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        throw error;
      }
      
      return data as unknown as CartItem[];
    },
    enabled: !!userId,
  });

  // Ajouter un article au panier
  const addToCart = useMutation({
    mutationFn: async ({ user_id, item_id, quantity }: AddToCartParams) => {
      // Vérifier d'abord si l'article existe déjà dans le panier
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user_id)
        .eq('shop_item_id', item_id)
        .single();
      
      if (existingItems) {
        // Si l'article existe déjà, mettre à jour la quantité
        const newQuantity = existingItems.quantity + quantity;
        
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', existingItems.id)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        // Récupérer d'abord l'ID de la boutique à partir de l'article
        const { data: shopItem, error: shopItemError } = await supabase
          .from('shop_items')
          .select('shop_id')
          .eq('id', item_id)
          .single();
        
        if (shopItemError) throw shopItemError;
        
        // Ajouter un nouvel article au panier
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id,
            shop_item_id: item_id,
            shop_id: shopItem.shop_id,
            quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart', userId]
      });
      
      toast({
        title: 'Article ajouté',
        description: 'L\'article a été ajouté à votre panier'
      });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'ajouter l\'article au panier'
      });
    }
  });

  // Mettre à jour la quantité d'un article
  const updateQuantity = useMutation({
    mutationFn: async ({ cartItemId, quantity }: UpdateQuantityParams) => {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', cartItemId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart', userId]
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour la quantité'
      });
    }
  });

  // Supprimer un article du panier
  const removeFromCart = useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);
      
      if (error) throw error;
      return cartItemId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart', userId]
      });
      
      toast({
        title: 'Article supprimé',
        description: 'L\'article a été retiré de votre panier'
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du panier:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article du panier'
      });
    }
  });

  // Vider le panier
  const clearCart = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart', userId]
      });
      
      toast({
        title: 'Panier vidé',
        description: 'Votre panier a été vidé avec succès'
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du panier:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de vider le panier'
      });
    }
  });

  return {
    cartItems,
    isCartLoading,
    cartError: error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: refetch
  };
};
