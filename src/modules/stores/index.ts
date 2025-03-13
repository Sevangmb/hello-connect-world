
/**
 * Module de magasins - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux magasins
 */

// Composants
import ShopMap from '@/components/shop/ShopMap';
import StoreMap from '@/components/stores/StoreMap';
import { ShopCard } from '@/components/shop/ShopCard';
import { StoreFilters } from '@/components/stores/StoreFilters';

// Pages
import ShopsMap from '@/pages/ShopsMap';
import Boutiques from '@/pages/Boutiques';

// Hooks
import { useStores } from '@/hooks/useStores';
import { useNearbyShops } from '@/hooks/shop/useNearbyShops';

// Export components
export { StoreFilters };
export { ShopCard };
export { ShopMap };
export { StoreMap };

// Export pages
export { ShopsMap };
export { Boutiques };

// Export hooks
export { useStores };
export { useNearbyShops };
