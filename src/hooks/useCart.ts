
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  user_id: string;
  shop_item_id: string;
  quantity: number;
  created_at: string;
  shop_items: {
    id: string;
    price: number;
    clothes: {
      name: string;
      image_url: string | null;
    };
  };
}

export function useCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: cartItems, isLoading: isCartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      console.log("Fetching cart items...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log("User ID:", user.id);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items!shop_item_id (
            id,
            price,
            clothes!shop_items_clothes_id_fkey (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching cart items:", error);
        throw error;
      }

      console.log("Cart items fetched:", data);
      return data as CartItem[];
    }
  });

  const addToCart = useMutation({
    mutationFn: async ({ shopItemId, quantity }: { shopItemId: string, quantity: number }) => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First check if the item already exists in the cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('shop_item_id', shopItemId)
        .single();

      if (existingItem) {
        // Update existing item quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select();

        if (error) throw error;
        return data;
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            shop_item_id: shopItemId,
            quantity
          })
          .select();

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
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string, quantity: number }) => {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error updating quantity:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive",
      });
    }
  });

  const removeFromCart = useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Article retiré",
        description: "L'article a été retiré de votre panier",
      });
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'article du panier",
        variant: "destructive",
      });
    }
  });

  return {
    cartItems,
    isCartLoading,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart
  };
}
