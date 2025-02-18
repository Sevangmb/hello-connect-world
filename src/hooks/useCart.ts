
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartItemType } from "@/types";

export function useCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          shop_items (
            id,
            price,
            clothes (
              name,
              image_url
            )
          )
        `);

      if (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }

      return data as CartItemType[];
    }
  });

  const addToCart = useMutation({
    mutationFn: async ({ shopItemId, quantity }: { shopItemId: string, quantity: number }) => {
      console.log('Adding to cart:', { shopItemId, quantity });
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('shop_item_id', shopItemId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingItem) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('shop_item_id', shopItemId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert([
            { shop_item_id: shopItemId, quantity }
          ])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Ajouté au panier",
        description: "L'article a été ajouté à votre panier",
      });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier",
        variant: "destructive",
      });
    }
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string, quantity: number }) => {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const removeFromCart = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Article retiré",
        description: "L'article a été retiré de votre panier",
      });
    }
  });

  return {
    cartItems: cartItems || [],
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart
  };
}
