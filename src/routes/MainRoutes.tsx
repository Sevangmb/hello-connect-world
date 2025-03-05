
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useModulePriority } from '@/hooks/modules/hooks/useModulePriority';

// Lazy load des composants pour réduire le bundle initial
const Landing = lazy(() => import('@/pages/Landing'));
const Home = lazy(() => import('@/pages/Home'));
const Auth = lazy(() => import('@/pages/Auth'));
const Waitlist = lazy(() => import('@/pages/Waitlist'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Admin = lazy(() => import('@/pages/Admin'));
const RootLayout = lazy(() => import('@/components/RootLayout').then(m => ({ default: m.RootLayout })));
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const PrivateRoute = lazy(() => import('@/components/auth/PrivateRoute').then(m => ({ default: m.PrivateRoute })));
const AdminRoute = lazy(() => import('@/modules/auth/components/AdminRoute').then(m => ({ default: m.AdminRoute })));
const PrelaunchRedirect = lazy(() => import('@/components/home/PrelaunchRedirect').then(m => ({ default: m.PrelaunchRedirect })));

// Pages admin avec lazy loading
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminWaitlist = lazy(() => import('@/pages/admin/AdminWaitlist'));
const AdminStats = lazy(() => import('@/pages/admin/AdminStats'));
const AdminContent = lazy(() => import('@/pages/admin/AdminContent'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminShops = lazy(() => import('@/pages/admin/AdminShops'));
const AdminMarketplace = lazy(() => import('@/pages/admin/AdminMarketplace'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminModules = lazy(() => import('@/pages/admin/AdminModules'));
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'));
const AdminMenus = lazy(() => import('@/pages/admin/AdminMenus'));
const AdminApiKeys = lazy(() => import('@/pages/admin/AdminApiKeys'));
const AdminBackups = lazy(() => import('@/pages/admin/AdminBackups'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'));
const AdminHelp = lazy(() => import('@/pages/admin/AdminHelp'));

// Préchargement intelligent des routes les plus utilisées
const preloadRoutes = () => {
  // Déterminer la page d'accueil en fonction du statut de connexion
  const isLoggedIn = !!localStorage.getItem('supabase.auth.token');
  
  // Précharger les routes principales en fonction du statut
  if (isLoggedIn) {
    import('@/pages/Home');
    import('@/components/RootLayout');
  } else {
    import('@/pages/Auth');
    import('@/pages/Landing');
  }
  
  // Préchargement différé des autres routes importantes
  setTimeout(() => {
    import('@/components/auth/PrivateRoute');
    import('@/components/home/PrelaunchRedirect');
  }, 2000);
};

const LoadingFallback = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <LoadingSpinner size="md" />
  </div>
);

export default function MainRoutes() {
  const { preloadPriorityModules } = useModulePriority();
  
  useEffect(() => {
    // Précharger les routes
    preloadRoutes();
    
    // Précharger les modules prioritaires
    preloadPriorityModules();
  }, [preloadPriorityModules]);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PrelaunchRedirect>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route element={<RootLayout />}>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/app" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/app/*" element={<PrivateRoute><Home /></PrivateRoute>} />
          </Route>
          
          {/* Routes admin avec AdminRoute pour la protection */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="waitlist" element={<AdminWaitlist />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="shops" element={<AdminShops />} />
            <Route path="marketplace" element={<AdminMarketplace />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="modules" element={<AdminModules />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="menus" element={<AdminMenus />} />
            <Route path="api-keys" element={<AdminApiKeys />} />
            <Route path="backups" element={<AdminBackups />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="help" element={<AdminHelp />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PrelaunchRedirect>
    </Suspense>
  );
}
