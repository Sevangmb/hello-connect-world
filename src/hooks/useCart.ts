
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { Loader2, Check, AlertCircle } from "lucide-react";

export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  added_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    seller_id: string;
    description?: string;
    stock?: number;
  };
}

export function useCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les articles du panier
  const { data: cartItems, isLoading, error } = useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products(
            id, 
            name, 
            price, 
            description, 
            image_url, 
            seller_id,
            stock
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching cart items:", error);
        throw error;
      }

      return data as CartItem[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Ajouter un article au panier
  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Vérifier si le produit existe déjà dans le panier
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select()
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      let result;
      if (existingItem) {
        // Mettre à jour la quantité
        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id)
          .select();

        if (error) throw error;
        result = data;
      } else {
        // Ajouter un nouvel article
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          })
          .select();

        if (error) throw error;
        result = data;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      toast({
        title: "Ajouté au panier",
        description: "L'article a été ajouté à votre panier",
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter cet article au panier",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 3000,
      });
    }
  });

  // Mettre à jour la quantité d'un article
  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      if (quantity <= 0) {
        throw new Error("La quantité doit être supérieure à 0");
      }

      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId)
        .eq("user_id", user.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },
    onError: (error) => {
      console.error("Error updating quantity:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 3000,
      });
    }
  });

  // Supprimer un article du panier
  const removeFromCart = useMutation({
    mutationFn: async (itemId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const { data, error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", user.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      toast({
        title: "Article supprimé",
        description: "L'article a été retiré de votre panier",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error removing from cart:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer cet article",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 3000,
      });
    }
  });

  // Vider le panier
  const clearCart = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vider votre panier",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 3000,
      });
    }
  });

  // Calculer le total du panier
  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  return {
    cartItems,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
  };
}
