
/**
 * Module de profil - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés au profil
 */

// Composants principaux
export { ProfileForm } from '@/components/profile/ProfileForm';
export { ProfileHeader } from '@/components/profile/ProfileHeader';
export { ProfileSettings } from '@/components/profile/ProfileSettings';
export { ProfileStats } from '@/components/profile/ProfileStats';
export { UserProfile } from '@/components/profile/UserProfile';

// Sous-composants
export { ProfileAvatar } from '@/components/profile/components/ProfileAvatar';
export { ProfileBasicInfo } from '@/components/profile/components/ProfileBasicInfo';
export { ProfileVisibility } from '@/components/profile/components/ProfileVisibility';

// Section boutique
export { PurchasesSection } from '@/components/profile/shop/PurchasesSection';
export { SalesSection } from '@/components/profile/shop/SalesSection';
export { ShopSection } from '@/components/profile/shop/ShopSection';

// Hooks
export { useProfile } from '@/hooks/useProfile';
