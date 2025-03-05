
/**
 * Module d'administration - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés à l'administration
 */

// Pages
export { default as AdminDashboard } from '@/pages/admin/AdminDashboard';
export { default as AdminUsers } from '@/pages/admin/AdminUsers';
export { default as AdminWaitlist } from '@/pages/admin/AdminWaitlist';
export { default as AdminStats } from '@/pages/admin/AdminStats';
export { default as AdminContent } from '@/pages/admin/AdminContent';
export { default as AdminOrders } from '@/pages/admin/AdminOrders';
export { default as AdminShops } from '@/pages/admin/AdminShops';
export { default as AdminMarketplace } from '@/pages/admin/AdminMarketplace';
export { default as AdminSettings } from '@/pages/admin/AdminSettings';
export { default as AdminModules } from '@/pages/admin/AdminModules';
export { default as AdminNotifications } from '@/pages/admin/AdminNotifications';
export { default as AdminMenus } from '@/pages/admin/AdminMenus';
export { default as AdminApiKeys } from '@/pages/admin/AdminApiKeys';
export { default as AdminBackups } from '@/pages/admin/AdminBackups';
export { default as AdminReports } from '@/pages/admin/AdminReports';
export { default as AdminHelp } from '@/pages/admin/AdminHelp';

// Composants
export { AdminMenu } from '@/components/admin/AdminMenu';
export { AdminLayout } from '@/components/admin/AdminLayout';
export { AdminHeader } from '@/components/admin/AdminHeader';
export { AdminLoginBypass } from '@/components/admin/AdminLoginBypass';
export { AdminMetricsOverview } from '@/components/admin/AdminMetricsOverview';
export { AdminSidebar } from '@/components/admin/AdminSidebar';
export { ContentManagement } from '@/components/admin/ContentManagement';
export { SiteSettings } from '@/components/admin/SiteSettings';
export { UsersManagement } from '@/components/admin/UsersManagement';

// Composants spécifiques
export { ModulesList } from '@/components/admin/modules/ModulesList';
export { ModuleFeatures } from '@/components/admin/modules/ModuleFeatures';
export { ModuleDependencies } from '@/components/admin/modules/ModuleDependencies';
export { ModuleDependencyGraph } from '@/components/admin/modules/ModuleDependencyGraph';

// Hooks
export { useAdminAuth } from '@/components/admin/hooks/useAdminAuth';
export { useModulesList } from '@/components/admin/modules/hooks/useModulesList';
export { useModuleToggle } from '@/components/admin/modules/hooks/useModuleToggle';
export { useModuleSave } from '@/components/admin/modules/hooks/useModuleSave';

// Types et utilitaires
export * from '@/components/admin/modules/components';
