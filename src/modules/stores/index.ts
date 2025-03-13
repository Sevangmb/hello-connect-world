
/**
 * Module de magasins - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux magasins
 */

// Composants
import ShopMap from '@/components/shop/ShopMap';
import StoreMap from '@/components/stores/StoreMap';
import { ShopCard } from '@/components/shop/ShopCard';

// Pages
import ShopsMap from '@/pages/ShopsMap';
import Boutiques from '@/pages/Boutiques';

// Hooks
export { useStores } from '@/hooks/useStores';
export { useNearbyShops } from '@/hooks/shop/useNearbyShops';

// Composants
export { StoreFilters } from '@/components/stores/StoreFilters';
export { ShopCard };
export { ShopMap };
export { StoreMap };

// Pages
export { ShopsMap };
export { Boutiques };
