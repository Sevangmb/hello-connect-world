
import { useCartQuery } from "./queries";
import { useCartMutations } from "./mutations";
import { UseCartResult } from "./types";
import { useCallback } from "react";
import { UpdateQuantityParams } from "./types";

export const useCart = (userId: string | null): UseCartResult => {
  const { 
    data: cartItems, 
    isLoading: isCartLoading, 
    error: cartError,
    refetch: refreshCart
  } = useCartQuery(userId);

  const { 
    addToCart: addToCartMutation,
    updateQuantity: updateQuantityMutation,
    removeFromCart: removeFromCartMutation,
    clearCart: clearCartMutation
  } = useCartMutations(userId);

  // Calculer le nombre total d'articles dans le panier
  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Calculer le sous-total du panier
  const subtotal = cartItems?.reduce((sum, item) => 
    sum + (item.shop_items.price * item.quantity), 0
  ) || 0;

  return {
    cartItems,
    isCartLoading,
    cartError,
    addToCart: addToCartMutation,
    updateQuantity: updateQuantityMutation,
    removeFromCart: removeFromCartMutation,
    clearCart: clearCartMutation,
    refreshCart,
    totalItems,
    subtotal
  };
};

export * from "./types";
