
/**
 * Module de panier - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés au panier
 */

// Composants
export { CartItemsList } from '@/components/cart/CartItemsList';
export { CartSidebar } from '@/components/cart/CartSidebar';
export { CartSummary } from '@/components/cart/CartSummary';
export { CheckoutButton } from '@/components/cart/CheckoutButton';

// Hooks
export { useCart } from '@/hooks/useCart';
export { useCheckout } from '@/hooks/useCheckout';

// API et types
export * from '@/hooks/cart/index';
export * from '@/hooks/cart/types';
export * from '@/hooks/cart/queries';
export * from '@/hooks/cart/mutations';
