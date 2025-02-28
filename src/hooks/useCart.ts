
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, ShoppingCart, AlertCircle } from "lucide-react";

export interface CartItem {
  id: string;
  quantity: number;
  shop_items: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    stock: number;
    seller_id: string;
    shop_id: string;
    shops: {
      name: string;
    }
  };
}

export function useCart(userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cart items
  const cartItems = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          quantity,
          shop_items:shop_item_id (
            id,
            name,
            description,
            price,
            image_url,
            stock,
            seller_id,
            shop_id,
            shops:shop_id (name)
          )
        `)
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      // Convertir explicitement le résultat au type attendu
      return data as unknown as CartItem[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });

  // Add item to cart
  const addToCart = useMutation({
    mutationFn: async ({
      itemId,
      quantity = 1,
    }: {
      itemId: string;
      quantity?: number;
    }) => {
      if (!userId) {
        throw new Error("Vous devez être connecté pour ajouter des articles au panier");
      }

      // Check if item is already in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("shop_item_id", itemId)
        .maybeSingle();

      // Get item details for the toast
      const { data: itemDetails, error: itemError } = await supabase
        .from("shop_items")
        .select("name, stock")
        .eq("id", itemId)
        .single();

      if (itemError) {
        console.error("Error fetching item details:", itemError);
        throw new Error("Impossible de récupérer les détails de l'article");
      }

      // Check stock availability
      if (itemDetails && (existingItem ? existingItem.quantity + quantity : quantity) > itemDetails.stock) {
        throw new Error(`Quantité non disponible. Stock restant: ${itemDetails.stock}`);
      }

      let result;
      if (existingItem) {
        // Update quantity if item is already in cart
        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id)
          .select();

        if (error) throw error;
        result = data;
      } else {
        // Add new item to cart
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: userId,
            shop_item_id: itemId,
            quantity,
          })
          .select();

        if (error) throw error;
        result = data;
      }

      toast({
        title: "Article ajouté au panier",
        description: itemDetails ? `${itemDetails.name} a été ajouté à votre panier` : "Article ajouté à votre panier",
        icon: { type: "icon", icon: ShoppingCart, className: "h-4 w-4" },
        duration: 3000,
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" },
        duration: 5000,
      });
    },
  });

  // Update cart item quantity
  const updateCartItem = useMutation({
    mutationFn: async ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => {
      if (!userId) {
        throw new Error("Vous devez être connecté pour modifier votre panier");
      }

      if (quantity <= 0) {
        throw new Error("La quantité doit être supérieure à 0");
      }

      // Get cart item details
      const { data: cartItem, error: cartItemError } = await supabase
        .from("cart_items")
        .select("shop_item_id")
        .eq("id", cartItemId)
        .single();

      if (cartItemError || !cartItem) {
        throw new Error("Article introuvable dans votre panier");
      }

      // Check stock availability
      const { data: itemDetails, error: itemError } = await supabase
        .from("shop_items")
        .select("stock, name")
        .eq("id", cartItem.shop_item_id)
        .single();

      if (itemError) {
        console.error("Error fetching item details:", itemError);
        throw new Error("Impossible de récupérer les détails de l'article");
      }

      if (itemDetails && quantity > itemDetails.stock) {
        throw new Error(`Quantité non disponible. Stock restant: ${itemDetails.stock}`);
      }

      // Update quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", cartItemId)
        .eq("user_id", userId)
        .select();

      if (error) throw error;

      toast({
        title: "Panier mis à jour",
        description: "La quantité a été mise à jour",
        icon: { type: "icon", icon: Check, className: "h-4 w-4 text-green-500" },
        duration: 3000,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (error) => {
      console.error("Error updating cart item:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" },
        duration: 5000,
      });
    },
  });

  // Remove item from cart
  const removeFromCart = useMutation({
    mutationFn: async (cartItemId: string) => {
      if (!userId) {
        throw new Error("Vous devez être connecté pour supprimer des articles du panier");
      }

      const { data, error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId)
        .eq("user_id", userId)
        .select();

      if (error) throw error;

      toast({
        title: "Article supprimé",
        description: "L'article a été retiré de votre panier",
        icon: { type: "icon", icon: Check, className: "h-4 w-4 text-green-500" },
        duration: 3000,
      });

      return data;
    },
    onMutate: async (cartItemId) => {
      // Cette fonction est appelée avant la mutation
      return { cartItemId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (error) => {
      console.error("Error removing from cart:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer cet article du panier",
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" },
        duration: 5000,
      });
    },
  });

  // Clear cart
  const clearCart = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("Vous devez être connecté pour vider votre panier");
      }

      const { data, error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .select();

      if (error) throw error;

      toast({
        title: "Panier vidé",
        description: "Tous les articles ont été retirés de votre panier",
        icon: { type: "icon", icon: Check, className: "h-4 w-4 text-green-500" },
        duration: 3000,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vider votre panier",
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" },
        duration: 5000,
      });
    },
  });

  // Create a data accessor for the Cart page to access the cartItems safely
  const isCartLoading = cartItems.isLoading;
  const cartItemsData = cartItems.data || [];
  
  // Utility function to maintain compatibility with existing code
  const updateQuantity = (params: { cartItemId: string; quantity: number }) => {
    updateCartItem.mutate(params);
  };

  return {
    cartItems: cartItemsData,
    isCartLoading,
    updateQuantity,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}
