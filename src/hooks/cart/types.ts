
import { CartItem } from "@/core/shop/domain/types";

export type AddToCartParams = {
  user_id: string;
  item_id: string;
  quantity: number;
};

export type UpdateQuantityParams = {
  cartItemId: string;
  quantity: number;
};

export interface UseCartResult {
  cartItems: CartItem[] | undefined;
  isCartLoading: boolean;
  cartError: unknown;
  addToCart: any;
  updateQuantity: any;
  removeFromCart: any;
  clearCart: any;
  refreshCart: () => void;
  totalItems: number;
  subtotal: number;
}
