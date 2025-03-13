
/**
 * Module de magasins - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux magasins
 */

// Composants
import StoreMap from '@/components/shop/ShopMap';
import { ShopCard } from '@/components/shop/ShopCard';

// Map components
import ShopsMap from '@/pages/ShopsMap';

// Hooks
export { useStores } from '@/hooks/useStores';
export { useNearbyShops } from '@/hooks/shop/useNearbyShops';

// Composants
export { StoreFilters } from '@/components/stores/StoreFilters';
export { ShopCard };
export { StoreMap };
export { ShopsMap };
