
/**
 * Module de valises - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux valises
 */

// Composants principaux
export { SuitcaseCard } from '@/components/suitcases/SuitcaseCard';
export { SuitcaseItems } from '@/components/suitcases/SuitcaseItems';
export { CreateSuitcaseDialog } from '@/components/suitcases/CreateSuitcaseDialog';

// Sous-composants
export * from '@/components/suitcases/components/SuitcaseCard';
export * from '@/components/suitcases/components/SuitcaseActions';
export * from '@/components/suitcases/components/SuitcaseCalendar';
export * from '@/components/suitcases/components/SuitcaseCalendarItemsList';
export * from '@/components/suitcases/components/SuitcaseDates';
export * from '@/components/suitcases/components/SuitcaseFilters';
export * from '@/components/suitcases/components/SuitcaseGrid';
export * from '@/components/suitcases/components/SuitcaseHeader';
export * from '@/components/suitcases/components/SuitcaseItemsList';
export * from '@/components/suitcases/components/SuitcaseListItem';
export * from '@/components/suitcases/components/SuitcaseSearchBar';
export * from '@/components/suitcases/components/SuitcaseSuggestionsDialog';
export * from '@/components/suitcases/components/SuitcaseViewToggle';
export * from '@/components/suitcases/components/EmptySuitcases';
export * from '@/components/suitcases/components/LoadingSuitcases';
export * from '@/components/suitcases/components/AddClothesDialog';

// Formulaires
export { CreateSuitcaseForm } from '@/components/suitcases/forms/CreateSuitcaseForm';

// Items
export * from '@/components/suitcases/items';

// Hooks
export * from '@/components/suitcases/hooks';
export { useSuitcaseCalendarItems } from '@/hooks/useSuitcaseCalendarItems';
export { useSuitcaseItems } from '@/hooks/useSuitcaseItems';

// Constants
export * from '@/components/suitcases/constants/status';

// Types
export * from '@/components/suitcases/utils/types';
