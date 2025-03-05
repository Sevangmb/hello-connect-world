/**
 * Module de magasins - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux magasins
 */

// Composants
import Boutiques from '@/components/Boutiques';
import StoreMap from '@/components/StoreMap';
export { Boutiques, StoreMap };

// Hooks
export { useStores } from '@/hooks/useStores';

// Composants
export { StoreFilters } from '@/components/stores/StoreFilters';
