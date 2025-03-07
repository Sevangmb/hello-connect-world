
import { useCart } from '@/hooks/cart';
import { CartPage } from '@/components/cart/CartPage';
import { CartIcon } from '@/components/cart/CartIcon';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { CartItem } from '@/core/shop/domain/types/cart-types';

// Re-export cart components
export {
  CartPage,
  CartIcon,
  CartSidebar,
  useCart
};

// Re-export types
export type { CartItem };

// Import types from hooks/cart explicitly but don't re-export to avoid conflicts
import type { AddToCartParams, UpdateQuantityParams } from '@/hooks/cart';
