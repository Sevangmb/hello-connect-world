
/**
 * Module de paramètres - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux paramètres
 */

// Composants généraux
export { SiteSettings } from '@/components/admin/SiteSettings';

// Composants spécifiques
export { CategoriesSettings } from '@/components/admin/settings/CategoriesSettings';
export { LogoSettings } from '@/components/admin/settings/LogoSettings';
export { MessagesSettings } from '@/components/admin/settings/MessagesSettings';
export { SettingsTabs } from '@/components/admin/settings/SettingsTabs';
export { SocialSettings } from '@/components/admin/settings/SocialSettings';
export { ThemeSettings } from '@/components/admin/settings/ThemeSettings';
export { AdminCheck } from '@/components/admin/settings/AdminCheck';

// Composants de catégories
export * from '@/components/admin/settings/categories/index';

// Hooks
export { useSettings } from '@/components/admin/settings/useSettings';
export { useCategoryManager } from '@/components/admin/settings/categories/useCategoryManager';
export { useCategoryForm } from '@/components/admin/settings/categories/useCategoryForm';
