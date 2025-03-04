
import { lazy, Suspense, useEffect } from 'react';
import { Route } from 'react-router-dom';
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
const AdminRoute = lazy(() => import('@/components/auth/AdminRoute').then(m => ({ default: m.AdminRoute })));
const PrelaunchRedirect = lazy(() => import('@/components/home/PrelaunchRedirect').then(m => ({ default: m.PrelaunchRedirect })));

// Pages admin avec lazy loading
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminWaitlist = lazy(() => import('@/pages/admin/AdminWaitlist'));
// ... autres pages admin

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
        <Route path="/landing" element={<Landing />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<RootLayout />}>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/app" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/app/*" element={<PrivateRoute><Home /></PrivateRoute>} />
        </Route>
        
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/waitlist" element={<AdminWaitlist />} />
          {/* Autres routes admin gardées identiques */}
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </PrelaunchRedirect>
    </Suspense>
  );
}
