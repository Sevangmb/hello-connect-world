
import { useQuery } from "@tanstack/react-query";
import { fetchCartItems } from "./queries";
import { useCartMutations } from "./mutations";
import { CartItem, UpdateCartItemParams } from "./types";

export type { CartItem } from "./types";

export function useCart(userId: string | null) {
  // Fetch cart items
  const { data: cartItems = [], isLoading: isCartLoading } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => fetchCartItems(userId),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });

  // Get cart mutations
  const { 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCartMutations(userId);

  // Utility function to maintain compatibility with existing code
  const updateQuantity = (params: UpdateCartItemParams) => {
    updateCartItem.mutate(params);
  };

  return {
    cartItems,
    isCartLoading,
    updateQuantity,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}
