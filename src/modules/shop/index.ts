
/**
 * Module de boutique - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés à la boutique
 */

// Composants principaux
export { ShopCard } from '@/components/shop/ShopCard'; 
export { ShopItems } from '@/components/shop/ShopItems';
export { CheckoutButton } from '@/components/shop/CheckoutButton';

// Sous-composants
export { ShopItemCard } from '@/components/shop/components/ShopItemCard';
export { ShopItemsFilter } from '@/components/shop/components/ShopItemsFilter';

// Hooks
export { useShopItems } from '@/components/shop/hooks/useShopItems';

// Types
export * from '@/components/shop/types/shop-items';
