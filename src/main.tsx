
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { ModulePageRegistry } from "@/services/modules/ModulePageRegistry";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import AdminLogin from "@/pages/AdminLogin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminShops from "@/pages/admin/AdminShops";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminMarketplace from "@/pages/admin/AdminMarketplace";
import AdminContent from "@/pages/admin/AdminContent";
import AdminStats from "@/pages/admin/AdminStats";
import AdminMarketing from "@/pages/admin/AdminMarketing";
import AdminModules from "@/pages/admin/AdminModules";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminHelp from "@/pages/admin/AdminHelp";
import { lazy, Suspense } from "react";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Récupérer les pages pour les routes
const modulePages = ModulePageRegistry.getAllPages();

// Routes disponibles sans authentification
const alwaysAvailableRoutes = [
  { path: "/landing", element: <Landing /> },
  { path: "/auth", element: <Auth /> },
  { path: "/auth/login", element: <Auth /> },
  { path: "/auth/admin", element: <AdminLogin /> },
];

// Loading fallback pour les composants chargés dynamiquement
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const App = () => {
  return (
    <Routes>
      {/* Routes toujours disponibles */}
      {alwaysAvailableRoutes.map(route => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* Route racine */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        }
      />

      {/* Routes d'administration */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="marketing" element={<AdminMarketing />} />
        <Route path="modules" element={<AdminModules />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="help" element={<AdminHelp />} />
      </Route>

      {/* Routes des modules - générées dynamiquement */}
      {modulePages.map(page => {
        // Créer un composant lazy pour le chargement dynamique
        const LazyComponent = lazy(() => 
          import(`@/pages/${page.path.replace(/^\//, '').split('/')[0]}`)
            .then(module => ({ default: module.default }))
            .catch(err => {
              console.error(`Erreur lors du chargement de ${page.path}:`, err);
              return import("@/pages/NotFound"); // Fallback à NotFound
            })
        );

        return (
          <Route
            key={page.path}
            path={page.path}
            element={
              <PrivateRoute>
                <ModuleGuard 
                  moduleCode={page.moduleCode} 
                  fallback={<Navigate to="/" replace />}
                >
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyComponent />
                  </Suspense>
                </ModuleGuard>
              </PrivateRoute>
            }
          />
        );
      })}

      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
