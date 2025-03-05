
/**
 * Module de navigation - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés à la navigation
 */

// Composants
export { BottomNav } from '@/components/navigation/BottomNav';
export { ModuleMenu } from '@/components/navigation/ModuleMenu';
export { MainSidebar } from '@/components/MainSidebar';
export { AdminSection } from '@/components/sidebar/AdminSection';
export { CommunitySection } from '@/components/sidebar/CommunitySection';
export { ExploreSection } from '@/components/sidebar/ExploreSection';
export { HomeSection } from '@/components/sidebar/HomeSection';
export { PersonalSection } from '@/components/sidebar/PersonalSection';
export { ProfileSection } from '@/components/sidebar/ProfileSection';

// Hooks
export { useMenu } from '@/hooks/useMenu';
export { useMenuCategories } from '@/hooks/menu/useMenuCategories';
export { useMenuItems } from '@/hooks/menu/useMenuItems';
export { useAdminStatus } from '@/hooks/menu/useAdminStatus';
