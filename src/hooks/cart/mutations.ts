
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddToCartParams, UpdateQuantityParams } from "./types";
import { useToast } from "../use-toast";

export const useCartMutations = (userId: string | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Ajouter au panier
  const addToCart = useMutation({
    mutationFn: async ({ user_id, item_id, quantity }: AddToCartParams) => {
      // Vérifier d'abord si l'article existe déjà dans le panier
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user_id)
        .eq('shop_item_id', item_id)
        .maybeSingle();
      
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
        // Ajouter un nouvel article au panier
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id,
            shop_item_id: item_id,
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

  // Mettre à jour la quantité
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
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};
