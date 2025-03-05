
/**
 * Module de vêtements - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux vêtements
 */

// Composants principaux
export { ClothesCard } from '@/components/clothes/ClothesCard';
export { ClothesList } from '@/components/clothes/ClothesList';
export { ClothesCalendar } from '@/components/clothes/ClothesCalendar';
export { ClothesFilters } from '@/components/clothes/ClothesFilters';
export { ClothesWornList } from '@/components/clothes/ClothesWornList';
export { AddClothesDialog } from '@/components/clothes/AddClothesDialog';
export { EditClothesDialog } from '@/components/clothes/EditClothesDialog';
export { EditClothesForm } from '@/components/clothes/EditClothesForm';
export { ClothesForm } from '@/components/clothes/ClothesForm';
export { VirtualTryOnForm } from '@/components/clothes/VirtualTryOnForm';
export { VirtualTryOnTabs } from '@/components/clothes/VirtualTryOnTabs';
export { ExtractClothingForm } from '@/components/clothes/ExtractClothingForm';
export { ClothesCalendarHeader } from '@/components/clothes/ClothesCalendarHeader';

// Composants de détection
export { ClothingDetector } from '@/components/clothes/components/ClothingDetector';
export { ClothesDetectionButtons } from '@/components/clothes/components/ClothesDetectionButtons';
export { ImageUploader } from '@/components/clothes/components/ImageUploader';

// Formulaires
export { ClothesBasicInfo } from '@/components/clothes/forms/ClothesBasicInfo';
export { ClothesDetails } from '@/components/clothes/forms/ClothesDetails';
export { ClothesHashtags } from '@/components/clothes/forms/ClothesHashtags';
export { ClothesImageUpload } from '@/components/clothes/forms/ClothesImageUpload';
export { ClothesOptions } from '@/components/clothes/forms/ClothesOptions';

// Hooks
export { useClothesForm } from '@/components/clothes/hooks/useClothesForm';
export { useClothes } from '@/hooks/useClothes';
export { useClothesCalendar } from '@/hooks/useClothesCalendar';
export { useClothesSubmit } from '@/hooks/useClothesSubmit';
export { useClothingDetection } from '@/hooks/useClothingDetection';
export { useClothingSets } from '@/hooks/useClothingSets';

// Constants
export * from '@/components/clothes/constants/categories';

// Types
export * from '@/components/clothes/types';
