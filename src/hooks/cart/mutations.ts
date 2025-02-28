
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Check, ShoppingCart } from "lucide-react";
import { 
  addItemToCart, 
  checkCartItemExists, 
  clearCart, 
  fetchItemDetails, 
  getCartItemWithStock, 
  removeCartItem, 
  updateCartItemQuantity 
} from "./queries";
import { AddToCartParams, UpdateCartItemParams } from "./types";

export function useCartMutations(userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Add item to cart
  const addToCart = useMutation({
    mutationFn: async ({ itemId, quantity = 1 }: AddToCartParams) => {
      if (!userId) {
        throw new Error("Vous devez être connecté pour ajouter des articles au panier");
      }

      // Check if item is already in cart
      const existingItem = await checkCartItemExists(userId, itemId);

      // Get item details and stock information
      const { shopItemData, clothesData } = await fetchItemDetails(itemId);

      // Check stock availability
      // Nous utilisons une valeur par défaut pour le stock
      const itemStock = clothesData?.stock || 999;
      const itemName = clothesData?.name || "Article";

      if ((existingItem ? existingItem.quantity + quantity : quantity) > itemStock) {
        throw new Error(`Quantité non disponible. Stock restant: ${itemStock}`);
      }

      let result;
      if (existingItem) {
        // Update quantity if item is already in cart
        result = await updateCartItemQuantity(
          userId, 
          existingItem.id, 
          existingItem.quantity + quantity
        );
      } else {
        // Add new item to cart
        result = await addItemToCart(userId, itemId, quantity);
      }

      toast({
        title: "Article ajouté au panier",
        description: `${itemName} a été ajouté à votre panier`,
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
    mutationFn: async ({ cartItemId, quantity }: UpdateCartItemParams) => {
      if (!userId) {
        throw new Error("Vous devez être connecté pour modifier votre panier");
      }

      if (quantity <= 0) {
        throw new Error("La quantité doit être supérieure à 0");
      }

      // Get cart item with stock information
      const { clothesData } = await getCartItemWithStock(cartItemId);

      // Nous utilisons une valeur par défaut pour le stock
      const itemStock = clothesData?.stock || 999;
      const itemName = clothesData?.name || "Article";

      if (quantity > itemStock) {
        throw new Error(`Quantité non disponible. Stock restant: ${itemStock}`);
      }

      // Update quantity
      const result = await updateCartItemQuantity(userId, cartItemId, quantity);

      toast({
        title: "Panier mis à jour",
        description: "La quantité a été mise à jour",
        icon: { type: "icon", icon: Check, className: "h-4 w-4 text-green-500" },
        duration: 3000,
      });

      return result;
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

      const result = await removeCartItem(userId, cartItemId);

      toast({
        title: "Article supprimé",
        description: "L'article a été retiré de votre panier",
        icon: { type: "icon", icon: Check, className: "h-4 w-4 text-green-500" },
        duration: 3000,
      });

      return result;
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
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("Vous devez être connecté pour vider votre panier");
      }

      const result = await clearCart(userId);

      toast({
        title: "Panier vidé",
        description: "Tous les articles ont été retirés de votre panier",
        icon: { type: "icon", icon: Check, className: "h-4 w-4 text-green-500" },
        duration: 3000,
      });

      return result;
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

  return {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart: clearCartMutation,
  };
}
